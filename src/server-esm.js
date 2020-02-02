/* eslint-disable no-global-assign */
// Set options as a parameter, environment variable, or rc file.
require = require('esm')(module /*, options*/);
require('./config/env').getEnv();
module.exports = require('./server');
