import { Server, Socket } from "socket.io";
import http from "http";
import { RequestHandler } from "express";

let socketServer: Server | null = null;

export const initializeSocketServer = (server: http.Server, session: RequestHandler): void => {
  socketServer = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["http://localhost:3000", "user"],
    },
    pingTimeout: 500,
    transports: ["websocket"],
  });
  const mapSession = (socket: any, next: any) => {
    session(socket.request, {} as any, next);
  }
  socketServer.use(mapSession)
  socketServer.on("connection", registerEventListeners);
};

const registerEventListeners = (socket: Socket): void => {
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};
