import { NextPage } from 'next';
import App, { AppInitialProps, AppProps } from 'next/app';
import '../client/styles.css';
import { justNames } from '../config/district';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// This default export is required in a new `pages/_app.js` file.
const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async appContext => {
  const [appProps, navDistricts] = await Promise.all([
    App.getInitialProps(appContext as any),
    justNames(),
  ]);

  // console.log(navDistricts);

  return ({
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      navDistricts,
    },
  } as AppInitialProps) as any;
};

export default MyApp;
