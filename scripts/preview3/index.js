require('babel-register')({
  "presets": [
    ["env", {
      "modules": 'commonjs',
      "loose": true
    }],
    'react',
  ],
  "plugins": [
    "es6-promise",
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
});


const run = require('./src/index.js').default;
console.log(run);

run();


