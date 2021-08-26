import { disableChat, enableChat } from "./chat";
import { disableCanvas, enableCanvas, fill } from "./paint";
import { getSocket } from "./sockets";

const chatDivs = document.querySelectorAll(".player__chat");
const wordDiv = document.querySelector(".paint__word");
const wordSpan = wordDiv.querySelector("#word");
const timer = document.querySelector(".timer__time");
const timerTime = timer.querySelectorAll("span");

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
    getSocket().emit(window.events.sendTime, { time: roundTime });
    setTimer(roundTime);
    roundTime--;
  }
};

export const resetPaint = () => {
  if (roundTimer) {
    clearInterval(roundTimer);
    timerTime[0].innerText = "0";
    timerTime[2].innerText = "00";
  }
  wordDiv.classList.add(HIDDEN_CLASS);
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN_CLASS));
};

export const handleStartRound = () => {
  disableCanvas();
  enableChat();
  resetPaint();
};

export const handleStartPaint = ({ word }) => {
  enableCanvas();
  disableChat();
  wordDiv.classList.remove(HIDDEN_CLASS);
  wordSpan.innerText = word;
  roundTime = 90;
  roundTimer = setInterval(startRoundTimer, 1000);
};

export const handleReceiveTime = ({ time }) => setTimer(parseInt(time, 10));
