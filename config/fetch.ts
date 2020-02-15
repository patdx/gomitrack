import unFetch from 'isomorphic-unfetch';
import fs from 'fs-extra';
import path from 'path';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { IncomingMessage } from 'http';
import originalUrl from 'original-url';
import urlJoin from 'url-join';

export async function fetch(
  req: IncomingMessage & Record<string, any>,
  src: string
) {
  if (typeof window === 'undefined') {
    // server
    if (process.env.NEXT_BUILD_PHASE === PHASE_DEVELOPMENT_SERVER && false) {
      // read from the fs as a shortcut

      const fsPath = path.resolve(path.join('./public', src));
      return await fs.readJSON(fsPath);
    } else {
      // read from the server
      const url = req ? originalUrl(req) : undefined;

      console.log('parsed url', url);

      const baseUrl = url
        ? `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`
        : undefined;

      const newSrc = baseUrl ? urlJoin(baseUrl, src) : undefined;
      console.log(newSrc);

      if (!newSrc) {
        console.log('cannot get url due to server mode with no absolute url');
        return {};
      }

      const response = await unFetch(newSrc);
      return await response.json();
    }
  } else {
    // client
    const response = await unFetch(src);
    return await response.json();
  }
}
