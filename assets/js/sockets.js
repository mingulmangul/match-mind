import { handleSendMsg } from "./chat";
import { handleFullUser } from "./notifications";
import { handleEnterUser, handleLeaveUser } from "./players";

let socket = null;

export const getSocket = () => socket;

export const initSocket = (newSocket) => {
  const { events } = window;
  socket = newSocket;
  socket.on(events.enterUser, handleEnterUser);
  socket.on(events.leaveUser, handleLeaveUser);
  socket.on(events.fullUser, handleFullUser);
  // socket.on(events.playerUpdate, handlePlayerUpdate);
  socket.on(events.sendMsg, handleSendMsg);
};
