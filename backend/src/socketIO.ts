import { Server, Socket } from "socket.io";
import http from "http";
import { RequestHandler } from "express";
import todoListListeners from "./todolist/events";
import todoItemListeners from "./todoitem/events";
import { loginRequiredSocket } from "./middlewares";

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
  socketServer.use(loginRequiredSocket)
  socketServer.on("connection", registerEventListeners);
};

const registerEventListeners = (socket: Socket): void => {
  const listeners = [
    ...todoListListeners,
    ...todoItemListeners,
  ];
  listeners.forEach((handler) => {
    socket.on(handler.event, handler.handler(socket));
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};
