import 'source-map-support/register';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import { Server as SocketIO } from 'socket.io';
import config from './config';
import errorResponder from './lib/express-middleware/errorResponder';
import successResponder from './lib/express-middleware/successResponder';
import initEventsService from './services/events';

export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: '*',
  credentials: true,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD',
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(successResponder);
app.use(errorResponder);

async function startServer() {
  try {
    const socketServer = http.createServer();
    const io = new SocketIO<any, any>(socketServer, {
      cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
      },
    });
    initEventsService(io, app);

    await app.listen(config.apiServerPort);
    socketServer.listen(config.socketServerPort, '0.0.0.0');

    console.info(
      `framer-realtime-data-api listening for WebSocket connections on port ${config.socketServerPort} and API requests on port ${config.apiServerPort}`
    );
  } catch (err) {
    console.error(`Error Starting Application: ${err.message || ''}`, err);
    process.exit(1);
  }
}

startServer();
