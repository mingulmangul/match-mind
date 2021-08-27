import { disableChat, enableChat } from "./chat";
import { disableCanvas, enableCanvas, fill } from "./paint";
import { highLightPainter } from "./players";
import { getSocket } from "./sockets";

const chatDivs = document.querySelectorAll(".player__chat");
const wordDiv = document.querySelector(".paint__word");
const wordSpan = wordDiv.querySelector("#word");
const timer = document.querySelector(".timer__time");
const timerTime = timer.querySelectorAll("span");
const answerDiv = document.querySelector("#answer");
const roundResultsDiv = document.querySelector(".round-results");
const painterName = document.querySelector("#painterName");
const playerName = document.querySelector("#playerName");
const painterPoint = document.querySelector("#painterPoint");
const playerPoint = document.querySelector("#playerPoint");
const roundReadyDiv = document.querySelector(".round-ready");
const roundNum = document.querySelector("#round");
const nextPainterName = document.querySelector("#nextPainter");
const rankDiv = document.querySelector(".rank");
const rankersName = document.querySelectorAll("#rankerName");
const rankersAnswer = document.querySelectorAll("#rankerAnswer");
const rankersScore = document.querySelectorAll("#rankerScore");

const WHITE = "#f2f2eb";
const HIDDEN_CLASS = "hidden";

let roundTime = 0;
let roundTimer = null;

const setTimer = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  timerTime[0].innerText = minutes;
  timerTime[2].innerText = String(seconds).padStart(2, "0");
};

const startRoundTimer = () => {
  if (roundTime < 0) {
    clearInterval(roundTimer);
  } else {
    setTimer(roundTime);
  }
  getSocket().emit(window.events.sendTime, { time: roundTime });
  roundTime--;
};

const resetTimer = () => {
  if (roundTimer) {
    clearInterval(roundTimer);
    timerTime[0].innerText = "0";
    timerTime[2].innerText = "00";
  }
};

export const resetPaint = () => {
  enableCanvas();
  enableChat();
  resetTimer();
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN_CLASS));
  wordDiv.classList.add(HIDDEN_CLASS);
  answerDiv.classList.add(HIDDEN_CLASS);
  roundResultsDiv.classList.add(HIDDEN_CLASS);
};

const resetRank = () => {
  for (let i = 0; i < 8; i++) {
    rankersName[i].innerText = " ";
    rankersAnswer[i].innerText = " ";
    rankersScore[i].innerText = " ";
  }
  rankDiv.classList.add(HIDDEN_CLASS);
};

export const handleStartRound = ({ painterNum }) => {
  resetPaint();
  disableCanvas();
  highLightPainter(painterNum);
};

export const handleStartPaint = ({ word }) => {
  enableCanvas();
  disableChat();
  wordDiv.classList.remove(HIDDEN_CLASS);
  wordSpan.innerText = word;
  roundTime = 30;
  roundTimer = setInterval(startRoundTimer, 1000);
};

export const handleReceiveTime = ({ time }) => setTimer(parseInt(time, 10));

export const handleEndRound = ({
  word,
  painter,
  paintPoint,
  playerNickname,
  playPoint,
}) => {
  disableCanvas();
  enableChat();
  resetTimer();
  answerDiv.innerText = word;
  answerDiv.classList.remove(HIDDEN_CLASS);
  highLightPainter(painter.playerNum);
  painterName.innerText = painter.nickname;
  painterPoint.innerText = paintPoint;
  playerName.innerText = playerNickname ? playerNickname : " ";
  playerPoint.innerText = playPoint ? playPoint : " ";
  roundResultsDiv.classList.remove(HIDDEN_CLASS);
};

export const handleShowPainter = ({ round, painter }) => {
  roundNum.innerText = round;
  nextPainterName.innerText = painter;
  roundReadyDiv.classList.remove(HIDDEN_CLASS);
  setTimeout(
    () => roundReadyDiv.classList.add(HIDDEN_CLASS),
    window.events.time
  );
};

export const handleShowRank = ({ players, beforePainterNum }) => {
  resetPaint();
  highLightPainter(beforePainterNum);
  players.sort((player1, player2) => player2.score - player1.score);
  for (let i = 0; i < players.length; i++) {
    rankersName[i].innerText = players[i].nickname;
    rankersAnswer[i].innerText = players[i].answer;
    rankersScore[i].innerText = players[i].score;
  }
  rankDiv.classList.remove(HIDDEN_CLASS);
  setTimeout(resetRank, 6000);
};
