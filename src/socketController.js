import events from "./events";

const socketController = (socket) => {
  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    console.log(`HI ${nickname}`);
  });
};

export default socketController;
