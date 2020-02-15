import { fetch } from './fetch';
import { IncomingMessage } from 'http';

// TODO: provide a read only adapter for web mode
// and a read-write adapter for dev mode

export class LowDbAdapter {
  constructor(private req: IncomingMessage, private src: string) {}

  async read() {
    const fetched = await fetch(this.req, this.src);
    return fetched;
  }

  async write(_data: object) {
    console.warn(`write was called but it's not supported`);
    // throw new Error('write not supported');
  }
}
