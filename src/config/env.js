import { memoize } from 'lodash';

export const getEnv = memoize(() => {
  require('dotenv').config();
});

getEnv();

/**
 * @param {string} key
 */
const required = key => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`could not get ENV key for required value ${key}`);
  }
  return value;
};

export const MONGO_URL = required('MONGO_URL');
