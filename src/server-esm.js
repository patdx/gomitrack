import { getEnv } from './config/env';
getEnv();
import app from './app';
import http, { ServerResponse } from 'http';

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
export default server;
