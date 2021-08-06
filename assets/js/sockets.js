import { handleDisconnectedUser, handleNewUser } from "./notifications";

let socket = null;

export const getSocket = () => socket;

const setSocket = (newSocket) => (socket = newSocket);

export const initSocket = (newSocket) => {
  const { events } = window;
  setSocket(newSocket);
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnectedUser, handleDisconnectedUser);
};
