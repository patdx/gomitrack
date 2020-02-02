import http from 'http';
import app from './app';
import { getEnv } from './config/env';
getEnv();

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
export default server;
