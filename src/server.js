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
let paintPoint = 10;
let playPoint = 10;

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
    if (timer) {
      clearTimeout(timer);
    }
    if (players.length >= 2) {
      if (gamePlaying) {
        return;
      }
      words = selectWordList();
      io.emit(events.readyGame, { gamePlaying: true });
      timer = setTimeout(() => {
        gamePlaying = true;
        setRound();
      }, 6000);
    } else {
      gamePlaying = false;
      showResults();
      io.emit(events.readyGame, { gamePlaying });
    }
  };
  const setRound = () => {
    if (words.length === 0) {
      showResults();
      return;
    }
    const { id, playerNum, nickname } = selectPainter();
    word = selectWord();
    io.emit(events.startRound);
    io.emit(events.showPainter, {
      round: 10 - words.length,
      painter: nickname,
    });
    timer = setTimeout(
      () => io.to(id).emit(events.startPaint, { word, playerNum }),
      events.time
    );
  };
  const showResults = () => {
    io.emit(events.showRank, { players });
    gamePlaying = false;
    setTimeout(checkNumOfPlayers, 6000);
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
      answer: 0,
      score: 0,
    };
    socket.playerInfo = player;
    players.push(player);
    io.emit(events.enterUser, { players });
    if (gamePlaying) {
      socket.emit(events.startRound);
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
    if (text == word) {
      const painter = players[beforePainterNum];
      const player = socket.playerInfo;
      painter.answer++;
      painter.score += paintPoint;
      player.answer++;
      player.score += playPoint;
      io.emit(events.endRound, {
        word,
        painter: painter.nickname,
        paintPoint,
        player: player.nickname,
        playPoint,
      });
      timer = setTimeout(setRound, events.time);
    }
  });

  // game
  socket.on(events.sendTime, ({ time }) => {
    if (time < 0) {
      io.emit(events.endRound, { word });
      timer = setTimeout(setRound, events.time);
    } else {
      roundTime = time;
      broadcast(events.receiveTime, { time });
    }
  });
});

// setInterval(() => console.log(players, players.length), 4000);
