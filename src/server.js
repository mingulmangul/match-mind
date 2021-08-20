import socketIO from "socket.io";
import server from "./app";
import events from "./events";

const io = socketIO(server);

const MAX_PLAYERS = 8;

let players = new Array();
const playerRooms = new Array(MAX_PLAYERS);
let gamePlaying = false;

const choosePainter = () => players[Math.floor(Math.random() * MAX_PLAYERS)];

io.on("connection", (socket) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const deleteUser = () => {
    const playerNum = socket.playerNum;
    playerRooms[playerNum] = undefined;
    players = players.filter((player) => player.playerNum != playerNum);
    io.emit(events.leaveUser, { playerNum });
    checkNumOfPlayers();
  };
  const checkNumOfPlayers = () => {
    if (players.length >= 2) {
      gamePlaying = true;
      io.emit(events.readyGame, { gamePlaying });
    } else {
      gamePlaying = false;
      io.emit(events.readyGame, { gamePlaying });
    }
  };

  // player
  socket.on(events.disconnect, () => deleteUser());
  socket.on(events.loginUser, ({ nickname }) => {
    const playerNum = playerRooms.findIndex(
      (playerRoom) => playerRoom === undefined
    );
    if (playerNum < 0) {
      socket.emit(events.fullUser);
      return;
    }
    playerRooms[playerNum] = true;
    socket.playerNum = playerNum;
    const player = {
      playerNum,
      nickname,
      avatar: null,
      score: 0,
      ready: false,
      paint: false,
    };
    players.push(player);
    io.emit(events.enterUser, { players });
    checkNumOfPlayers();
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

  // game
  socket.on(events.startGame, () => {
    const painter = choosePainter();
    painter.paint = true;
  });
});

setInterval(() => console.log(players, players.length), 4000);
