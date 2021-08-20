import socketIO from "socket.io";
import server from "./app";
import events from "./events";
import selectWordList from "./words";

const io = socketIO(server);

const MAX_PLAYERS = 8;

let players = new Array();
const playerRooms = new Array(MAX_PLAYERS);
let gamePlaying = false;
let beforePainterNum = null;
let words = null;

const selectPainter = () => {
  players.forEach((player) => {
    player.paint = false;
    player.chat = true;
  });
  let painterNum = Math.floor(Math.random() * players.length);
  if (painterNum === beforePainterNum) {
    painterNum = (painterNum + 1) % players.length;
  }
  const painter = players[painterNum];
  painter.paint = true;
  painter.chat = false;
  beforePainterNum = painterNum;
};

const selectWord = () => {
  const selected = words[Math.floor(Math.random() * words.length)];
  words = words.filter((word) => word != selected);
  return selected;
};

io.on("connection", (socket) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const deleteUser = () => {
    const playerNum = socket.playerInfo.playerNum;
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
    const player = {
      playerNum,
      nickname,
      avatar: null,
      score: 0,
      ready: false,
      paint: gamePlaying ? false : true,
      chat: gamePlaying ? false : true,
    };
    socket.playerInfo = player;
    players.push(player);
    io.emit(events.enterUser, { players });
    checkNumOfPlayers();
  });
  socket.on(events.logoutUser, () => deleteUser());

  // paint
  socket.on(events.fillCanvas, ({ color }) => {
    if (socket.playerInfo.paint) {
      io.emit(events.filledCanvas, { color });
    }
  });
  socket.on(events.sendPath, ({ x, y }) => {
    if (socket.playerInfo.paint) {
      io.emit(events.receivePath, { x, y });
    }
  });
  socket.on(events.sendStroke, ({ x, y, color }) => {
    if (socket.playerInfo.paint) {
      io.emit(events.receiveStroke, { x, y, color });
    }
  });

  // chat
  socket.on(events.submitMsg, ({ text }) => {
    if (socket.playerInfo.chat) {
      io.emit(events.sendMsg, { text, playerNum: socket.playerInfo.playerNum });
    }
  });

  // game
  socket.on(events.startGame, () => {
    selectPainter();
    words = selectWordList();
    io.emit(events.paintWord, { word: selectWord() });
  });
});

// setInterval(() => console.log(players, players.length), 4000);
