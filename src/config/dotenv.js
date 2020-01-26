import { memoize } from 'lodash';

module.exports.getEnv = memoize(() => {
  require('dotenv').config();
});
