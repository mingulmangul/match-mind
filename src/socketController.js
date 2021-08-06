import events from "./events";

const socketController = (socket) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    broadcast(events.newUser, { nickname });
  });
  socket.on(events.disconnect, () => {
    broadcast(events.disconnectedUser, { nickname: socket.nickname });
  });
  socket.on(events.submitMsg, ({ text }) => {
    broadcast(events.sendMsg, { text, nickname: socket.nickname });
  });
};

export default socketController;
