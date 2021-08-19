import socketIO from "socket.io";
import server from "./app";
import events from "./events";

const io = socketIO(server);

const players = new Array(8);

io.on("connection", (socket) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const deleteUser = () => {
    const playerNum = socket.playerNum;
    players[playerNum] = undefined;
    io.emit(events.leaveUser, { playerNum });
  };

  socket.on(events.loginUser, ({ nickname }) => {
    const playerNum = players.findIndex((player) => player === undefined);
    if (playerNum < 0) {
      socket.emit(events.fullUser);
      return;
    }
    socket.playerNum = playerNum;
    socket.nickname = nickname;
    const player = {
      playerNum,
      nickname,
      score: 0,
      avatar: null,
    };
    players[playerNum] = player;
    io.emit(events.enterUser, { players });
  });

  socket.on(events.logoutUser, () => deleteUser());

  socket.on(events.disconnect, () => deleteUser());

  socket.on(events.submitMsg, ({ text }) => {
    broadcast(events.sendMsg, { text, nickname: socket.nickname });
  });
});

setInterval(() => console.log(players), 4000);
