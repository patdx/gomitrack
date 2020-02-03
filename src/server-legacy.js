/* eslint-disable no-global-assign */
require('ts-node').register();
require('./config/env').getEnv();
const server = require('./server').default;
// @ts-ignore
server.listen(3000, () => {
  console.log('listening on port 3000');
});
