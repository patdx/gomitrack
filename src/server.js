// Set options as a parameter, environment variable, or rc file.
require = require('esm')(module /*, options*/);
require('./config/dotenv').getEnv();
module.exports = require('./server-esm');
