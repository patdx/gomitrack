import { memoize } from 'lodash';

export const getEnv = memoize(() => {
  require('dotenv').config();
});
