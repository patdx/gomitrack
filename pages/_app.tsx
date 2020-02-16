import '../client/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />;
};

export default MyApp;
