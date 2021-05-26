import { Application, Request, Response } from 'express';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface PrototypeState {}

const initialState: PrototypeState = {};

const appState: {
  globalState: PrototypeState;
  connectedDevices: Set<string>;
  connectedDeviceState: Record<string, PrototypeState>;
} = {
  connectedDevices: new Set(),
  connectedDeviceState: {},
  globalState: initialState,
};

export default (
  io: Server<
    DefaultEventsMap,
    {
      globalEvent: any;
      globalStateUpdate: any;
    }
  >,
  apiServer: Application
): void => {
  function updateGlobalState(
    newState: PrototypeState | Partial<PrototypeState>,
    patch = false
  ) {
    if (!patch) {
      appState.globalState = newState;
    } else {
      appState.globalState = {
        ...appState.globalState,
        ...newState,
      };
    }
    io.emit('globalStateUpdate', appState.globalState);
    return appState.globalState;
  }

  io.on('connection', (socket) => {
    console.log(`Device on socket ID ${socket.id} connected!`);
    appState.connectedDevices.add(socket.id);

    socket.on(
      'globalEvent',
      (message: { eventName: string; payload: Partial<PrototypeState> }) => {
        socket.emit('globalEvent', message);

        switch (message.eventName) {
          case 'update:state':
            updateGlobalState(message.payload);
            break;
          default:
            socket.broadcast.emit('globalEvent', message);
        }
      }
    );
  });

  /**
   * Most communication happens via web sockets, but we'll also serve a simple
   * REST API for updating the state when getting a socket connection is cumbersome.
   * Useful for debugging.
   */
  apiServer.get('/v1/initial-state', async (req: Request, res: Response) => {
    res.success(appState.globalState);
  });

  apiServer.patch('/v1/global-state', async (req: Request, res: Response) => {
    res.success(updateGlobalState(req.body, true));
  });

  apiServer.put('/v1/global-state', async (req: Request, res: Response) => {
    res.success(updateGlobalState(req.body));
  });

  apiServer.patch('/v1/local-state', async (req: Request, res: Response) => {
    res.success(initialState);
  });
};
