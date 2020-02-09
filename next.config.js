module.exports = {
  webpack: (/** **/ config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
    }

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      // import the polyfills for client rendering
      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./client/polyfills.ts')
      ) {
        entries['main.js'].unshift('./client/polyfills.ts');
      }

      return entries;
    };

    return config;
  },
};
