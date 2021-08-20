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

  // player
  socket.on(events.disconnect, () => deleteUser());
  socket.on(events.loginUser, ({ nickname }) => {
    const playerNum = players.findIndex((player) => player === undefined);
    if (playerNum < 0) {
      socket.emit(events.fullUser);
      return;
    }
    socket.playerNum = playerNum;
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

  // paint
  socket.on(events.fillCanvas, ({ color }) =>
    broadcast(events.filledCanvas, { color })
  );
  socket.on(events.sendPath, ({ x, y }) =>
    broadcast(events.receivePath, { x, y })
  );
  socket.on(events.sendStroke, ({ x, y, color }) =>
    broadcast(events.receiveStroke, { x, y, color })
  );

  // chat
  socket.on(events.submitMsg, ({ text }) =>
    io.emit(events.sendMsg, { text, playerNum: socket.playerNum })
  );
});

// setInterval(() => console.log(players), 4000);
