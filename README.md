# alodi

> This is a project same as swaggerui, with additional support of sorting and filtering
> Make life better

## Environment

`Node >= 8`

## usage
```bash
# 全局安装
##  npm  无法按如下 方式 直接安装gitlab 上的包 
## npm install -g git@git.skyeye.world:NGSOC-FE/alodi-sdk.git
##  先clone 下来，  进入对应目录，npm install ./ -g

PORT=3332 alodi preview dist/index.json # cli alone
PORT=3333 alodi mock

```

## develop

 - Clone or download this repository
 - Enter your local directory, and install dependencies:

``` bash
yarn
// else
npm install
```

### Scripts

``` javascript
"scripts": {
  "dev": "node build/dev-server.js",
  "build": "node build/build.js"
},
```

