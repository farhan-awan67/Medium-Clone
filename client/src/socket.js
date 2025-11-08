import { io } from "socket.io-client";
const isProd = import.meta.env.MODE === "production";

const socketURL = isProd
  ? import.meta.env.VITE_SOCKET_URL_PROD
  : import.meta.env.VITE_SOCKET_URL_LOCAL;

const socket = io(socketURL, { autoConnect: false });

export default socket;
