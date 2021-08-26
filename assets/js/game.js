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
  resetTimer();
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN_CLASS));
  wordDiv.classList.add(HIDDEN_CLASS);
  answerDiv.classList.add(HIDDEN_CLASS);
  roundResultsDiv.classList.add(HIDDEN_CLASS);
};

export const handleStartRound = () => {
  disableCanvas();
  resetPaint();
};

export const handleStartPaint = ({ word, playerNum }) => {
  highLightPainter(playerNum);
  enableCanvas();
  disableChat();
  wordDiv.classList.remove(HIDDEN_CLASS);
  wordSpan.innerText = word;
  roundTime = 30;
  roundTimer = setInterval(startRoundTimer, 1000);
};

export const handleReceiveTime = ({ time }) => setTimer(parseInt(time, 10));

export const handleEndRound = ({ word, painter, player }) => {
  disableCanvas();
  enableChat();
  resetTimer();
  answerDiv.innerText = word;
  answerDiv.classList.remove(HIDDEN_CLASS);
  if (painter && player) {
    painterName.innerText = painter;
    playerName.innerText = player;
  }
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

export const handleShowRank = ({ player }) => {
  player.sort((player1, player2) => player2.score - player1.score);
  for (let i = 0; i < player.length; i++) {
    rankersName[i].innerText = player[i].nickname;
    rankersAnswer[i].innerText = player[i].answer;
    rankersScore[i].innerText = player[i].score;
  }
  rankDiv.classList.remove(HIDDEN_CLASS);
  setTimeout(() => rankDiv.classList.add(HIDDEN_CLASS), 6000);
};
