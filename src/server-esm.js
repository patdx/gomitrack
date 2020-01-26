import { getEnv } from './config/dotenv';
getEnv();
import app from './app';
import http from 'http';

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
export default server;
