//const fetch = require('fetch');
//const CookieJar = fetch.CookieJar;

const debug_proxy = require('debug')('mock:proxy');
const httpProxy = require('http-proxy');


const proxy = httpProxy.createProxyServer({});

function cookieStringify(cookie) {
  let keys = ['path', 'domain', 'expires'];
  let str = keys.filter(key => cookie[key]).map(key => `${key}=${cookie[key]}`).concat([`${cookie.name}=${cookie.value}`]).concat(cookie.httponly ? ['HttpOnly'] : []).join(';');
  debug_cookie('stringify', cookie);
  debug_cookie('stringify', str);
  return str;
}

function modifyCookieDomain(cookiestrings, domain) {
  let jar = new CookieJar();
  cookiestrings.forEach(cookie => {
    debug_cookie('cookie', cookie);
    jar.setCookie(cookie);
  });
  let rcookies = [];
  for (let [name, cookies] of Object.entries(jar.cookies)) {
    cookies.forEach(cookie => {
      cookie.domain = '';
      rcookies.push(cookieStringify(cookie));
    });
  }
  debug_cookie('cookiejar', JSON.stringify(jar.cookies));
  return rcookies;
}

function passProxy({ server, host, req, res, headers}) {
  debug_proxy('passProxy', req.url,req.path);

  let target = host;
  let _headers = Object.assign({
    'Host': headers.origin,
    'Accept': 'application/json, */*',
    'Content-Type': 'application/json'
  }, headers)

  debug_proxy(target, _headers);
  proxy.web(req, res, {
    target: target,
    headers: _headers,
    changeOrigin: true,
  }, function(err, preq, pres, url) {
    debug_proxy('proxy.callback',url, err);
    debug_proxy('preq.headers', preq.headers);
    debug_proxy('pres.headers', pres.headers);
    if (err) {
      res.status(400)
      res.send(JSON.stringify(url));
      res.end(JSON.stringify(err));
    } else {
      //pres.pipe(res);
      //  根据response header content-type返回text/json/application/binary等
      res.json(url);
    }
  });
}

proxy.on('proxyRes', function (proxyRes, req, res) {
  debug_proxy('RAW Response from the target', req.path,JSON.stringify(proxyRes.headers, true, 2));
  debug_proxy('RAW Response from the target', proxyRes.body);
});
proxy.on('proxyReq', function (proxyReq, req, res) {
  debug_proxy('Request ', proxyReq.method, proxyReq.path);
});

module.exports = {
  proxy,
  passProxy,
};
