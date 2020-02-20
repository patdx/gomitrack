import '../client/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />;
};

export default MyApp;
