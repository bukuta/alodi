const Mock = require('mockjs');
const path = require('path');

const url = require('url');

const express = require('express');
const pathToRegexp = require('path-to-regexp')
const collector = require('../../helper/collector.js')

const storageService = require('./storage');

const debug = require('debug')('mock');
const debug_cookie = require('debug')('mock:cookie');
const debug_todo = require('debug')('mock:todo');
const debug_proxy = require('debug')('mock:proxy0');

const {proxy,passProxy} = require('./proxy.js');



function fixBindHost(server) {
  let origin;
  let _url = url.parse(server.url);
  origin = _url.host;

  _url.host = server['x-host'] || _url.host;

  return {
    target: url.format(_url),
    origin,
  };
}

function matchPath(responses, req, method) {
  let url = req.path;
  if (!responses) {
    return;
  }
  if (responses[url] && responses[url][method]) {
    // fast match
    //debug('fast-match', responses[url][method]);
    return responses[url][method];
  } else {
    for (let path in responses) {
      let response = responses[path][method];
      let r = response && response.regPath.exec(url);
      let params = {};
      if (r) {
        debug(url, path, response.regPath, response.keys);
        debug('match', r);
        let keys = response.keys;
        keys.map((key, index) => {
          params[key.name] = r[index + 1];
        });
        debug('params', params);
        req.params = params;
        return response;
      }
    }
    //Object.keys(responses).filter(path
  }
}
function buildRandom(spec){
  let xrandoms = spec['x-random'];
  let randoms = {};

  Object.entries(xrandoms).forEach(([name,funstr])=>{
    debug(name,funstr);
    let fun = new Function('','return '+funstr)()(Mock.Random);
    randoms[name]=fun;
  });
  Mock.Random.extend(randoms);
}


let responses={};
let rootspec;
let responseDecorations;
let currentServer;

async function setupMockByDocs() {
  rootspec = await storageService.getSpecs();
  responseDecorations = await storageService.getDecorations();
  currentServer = await storageService.getCurrentServer();

  buildRandom(rootspec);

  let specs = rootspec.paths;
  let proxies = rootspec.servers;

  for (let path in specs) {
    let spec = specs[path];
    let keys = [];
    let store = responses[path] = responses[path] || {};

    // /admins/{adminId}/sites
    // =>
    // /admins/:adminId/sites
    let regPath = path.replace(/(\{([^}]+)\})/g, ':$2');
    regPath = pathToRegexp(regPath, keys);
    debug(path, regPath);

    for (let method in spec) {
      let methodSpec = spec[method];
      let params = methodSpec.parameters;
      let description = methodSpec.description;
      //let methodResponses = store[method] = responses[method] || {};

      store[method] = {
        path,
        method,
        description,
        regPath,
        keys,
        root:rootspec,
        responses: methodSpec.responses,
        spec: methodSpec,
      };
    }
  }
}


function localResponse(match, req, res) {
  let rd = responseDecorations[match.path];
  let skipcode = {};

  if (rd) {
    if (rd.skip) {
      return next();
    }
    rd = rd.methods[method];
    if (rd) {
      if (rd.skip) {
        return next();
      }
      rd = rd.responses;
      Object.keys(rd).forEach(code => {
        if (rd[code].skip) {
          skipcode[code] = true;
        }
      });
    }
  }

  let params = match.spec.parameters;
  debug(params);
  debug_todo('validate parameters');
  debug_todo('check request.contenttype');

  // CODES=200,201

  let statusCodes = Object.keys(match.responses).filter(code => !skipcode[code]);
  debug('statusCodes', statusCodes);
  statusCodes = statusCodes.filter(c=>c<400);

  let random = parseInt(Math.random() * statusCodes.length, 10);
  let statusCode = statusCodes[random];



  let response = match.responses[statusCode];
  //res.end(JSON.stringify(req.params));
  res.status(statusCode);
  let mock = collector.collectMocksFromResponse(response, rootspec);
  let data = '';
  if (mock) {
    if (mock.type == 'array') {
      mock['mock2|1-10'] = [mock.mock];
    }
    data = Mock.mock(mock);
    debug_todo('check response.contenttype');
    if (mock.type == 'array') {
      data = data.mock2;
    } else {
      data = data.mock;
    }
    debug(data);
    res.json(data);
  } else {
    res.end(response.description);
  }
}

function handleMock(req,res,next){
  debug('req.url', req.method, req.url);
  let proxies = rootspec.servers;
  let method = req.method.toLowerCase();
  let match = matchPath(responses, req, method)


  if (match) {
    debug('matched')
    let spec = match.spec;
    //let rd_proxy = responseDecorations[match.path];
    let rd_proxy = null;
    if(spec['x-proxy']){
      debug('spec.x-proxy',spec['x-proxy']);
      debug('root.servers',rootspec.servers);
      rd_proxy = {
        proxyEnable:true,
        proxy: rootspec.servers.find(server=>server.name == spec['x-proxy']).url,
      };
    }
    debug('rd_proxy', rd_proxy);

    if (rd_proxy) {
      if (rd_proxy.proxyEnable && rd_proxy.proxy) {
        debug_proxy('path', rd_proxy);
        let _server = rd_proxy.proxy;
        let server = proxies.filter(ser => ser.url == _server)[0];
        debug_proxy(_server);
        let {target, origin} = fixBindHost(server);

        if (origin) {
          return passProxy({ req, res, server, host: target, headers: { origin: origin, } })
        } else {
          return localResponse(match, req, res);
        }
      }

      rd_proxy = rd_proxy.methods[method];
      debug_proxy('rd_proxy-method', rd_proxy);
      if (rd_proxy) {
        if (rd_proxy.proxyEnable && rd_proxy.proxy) {
          // path && method
          debug_proxy('path.method', rd_proxy);
          let _server = rd_proxy.proxy;
          let server = rootspec.servers.filter(ser => ser.url == _server)[0];
          let {target, origin} = fixBindHost(server);
          let host = server && server['x-host'] || _server;


          debug_proxy(server, target, origin);
          // /api/v1 本地mock，
          if (origin) {
            return passProxy({
              req,
              res,
              server,
              host: target,
              headers: {
                origin: origin,
              }
            })
          } else {
            return localResponse(match, req, res);
          }
        }
      }
    }
    debug('match.2', match);

    if (currentServer) {
      let {target, origin} = fixBindHost(currentServer);
      debug(target, origin);
      return passProxy({
        req,
        res,
        server,
        host: target,
        headers: {
          origin: origin,
        }
      })
    } else {
      debug('nocurrentServer');
      localResponse(match, req, res);
    }
  } else {
    debug('no match and router.next');
    next();
  }
}

let router = express.Router();
router.use(function (req, res, next) {
  res.header("X-powered-by", "Alodi mocker")
  next()
})

setupMockByDocs();
// 查看currentServer, 如果为本地，使用本地mock,如果本地mock无法匹配，next()
// 如果为特定http服务器，使用proxy
// 如果有

let projectJson = require(path.resolve(process.cwd(),'package.json'));
let mockConfig = projectJson.mockConfig || {};
debug('mockConfig',mockConfig);

if(mockConfig.prefix){
  router.use(mockConfig.prefix,handleMock);
}else{
  router.use(handleMock);
}

module.exports = {
  router,
};
