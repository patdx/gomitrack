import { getEnv } from './config/dotenv';
getEnv();
import app from './app';
import http from 'http';

/**
 * Create HTTP server.
 */

let server = http.createServer(app);
export default server;
