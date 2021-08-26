import socketIO from "socket.io";
import server from "./app";
import events from "./events";
import selectWordList from "./words";

const io = socketIO(server);

const MAX_PLAYERS = 8;

let players = new Array();
const playerRooms = new Array(MAX_PLAYERS);
let gamePlaying = false;
let beforePainterNum = -1;
let words = null;
let word = null;
let roundTime = 0;

let timer = null;

const selectPainter = () => {
  let painterNum = Math.floor(Math.random() * players.length);
  if (painterNum === beforePainterNum) {
    painterNum = (painterNum + 1) % players.length;
  }
  beforePainterNum = painterNum;
  const painter = players[painterNum];
  return painter;
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
      if (gamePlaying) {
        return;
      }
      if (timer) {
        clearTimeout(timer);
      }
      words = selectWordList();
      io.emit(events.readyGame, { gamePlaying: true });
      timer = setTimeout(() => {
        gamePlaying = true;
        setRound();
      }, 5000);
    } else {
      gamePlaying = false;
      io.emit(events.readyGame, { gamePlaying });
    }
  };
  const setRound = () => {
    if (words.length === 0) {
      // 게임 종료
      showResults();
      return;
    }
    const { id } = selectPainter();
    word = selectWord();
    io.emit(events.startGame);
    io.to(id).emit(events.startPaint, { word });
  };
  const showResults = () => {
    console.log("게임끝~");
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
      id: socket.id,
      playerNum,
      nickname,
      avatar: null,
      score: 0,
    };
    socket.playerInfo = player;
    players.push(player);
    io.emit(events.enterUser, { players });
    if (gamePlaying) {
      socket.emit(events.startGame);
      socket.emit(events.receiveTime, { roundTime });
    } else {
      checkNumOfPlayers();
    }
  });
  socket.on(events.logoutUser, () => deleteUser());

  // paint
  socket.on(events.fillCanvas, ({ color }) => {
    broadcast(events.filledCanvas, { color });
  });
  socket.on(events.sendPath, ({ x, y }) => {
    broadcast(events.receivePath, { x, y });
  });
  socket.on(events.sendStroke, ({ x, y, color }) => {
    broadcast(events.receiveStroke, { x, y, color });
  });

  // chat
  socket.on(events.submitMsg, ({ text }) => {
    io.emit(events.sendMsg, { text, playerNum: socket.playerInfo.playerNum });
  });

  // game
  socket.on(events.sendTime, ({ time }) => {
    roundTime = time;
    broadcast(events.receiveTime, { time });
  });
});

// setInterval(() => console.log(players, players.length), 4000);
