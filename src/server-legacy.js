/* eslint-disable no-global-assign */
// Set options as a parameter, environment variable, or rc file.
require = require('esm')(module /*, options*/);
require('./config/env').getEnv();
const server = require('./server-esm').default;
// @ts-ignore
server.listen(3000, () => {
  console.log('listening on port 3000');
});
