const { memoize } = require('lodash');

module.exports.getEnv = memoize(() => {
  require('dotenv').config();
});
