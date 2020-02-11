module.exports = {
  webpack: (
    /** @type {import('webpack').Configuration} **/ config,
    { isServer }
  ) => {
    config.node = config.node || {};

    console.log(`${JSON.stringify({ isServer })}`, config);

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node.fs = 'empty';
    }

    return config;
  },
};
