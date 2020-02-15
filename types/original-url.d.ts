declare module 'original-url' {
  import url from 'url';
  import http from 'http';

  function originalUrl(req: http.IncomingMessage): url.URL;

  export = originalUrl;
}
