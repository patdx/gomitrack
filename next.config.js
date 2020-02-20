const merge = require('webpack-merge');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
require('dotenv').config();

module.exports = phase => ({
  env: (() => {
    console.log(JSON.stringify({ phase }));

    const isDev = PHASE_DEVELOPMENT_SERVER === phase;
    console.log(JSON.stringify({ isDev }));

    return {
      NEXT_BUILD_PHASE: phase,
      MAPS_URL: process.env.MAPS_URL,
    };
  })(),
  webpack: (
    /** @type {import('webpack').Configuration} **/ config,
    { isServer }
  ) => {
    const output = merge(
      config,
      isServer
        ? {}
        : {
            node: {
              fs: 'empty',
              net: 'empty',
            },
            externals: {
              'fs-extra': '{}',
              'original-url': '{}',
            },
          }
    );

    return output;
  },
});
