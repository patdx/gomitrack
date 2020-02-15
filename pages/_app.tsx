import App, { AppContext, AppInitialProps } from 'next/app';
import '../client/styles.css';
import { justNames } from '../config/district';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const [appProps, navDistricts] = await Promise.all([
    App.getInitialProps(appContext as any),
    justNames(appContext.ctx.req!),
  ]);

  return ({
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      navDistricts,
    },
  } as AppInitialProps) as any;
};

export default MyApp;
