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
const resultsDiv = document.querySelector(".results");
const painterName = resultsDiv.querySelector("#painterName");
const playerName = resultsDiv.querySelector("#playerName");

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
  resultsDiv.classList.add(HIDDEN_CLASS);
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
  resultsDiv.classList.remove(HIDDEN_CLASS);
};
