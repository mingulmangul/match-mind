import { disableChat, enableChat } from "./chat";
import { disableCanvas, enableCanvas, fill } from "./paint";
import { getSocket } from "./sockets";

const chatDivs = document.querySelectorAll(".player__chat");
const wordDiv = document.querySelector(".paint__word");
const wordSpan = wordDiv.querySelector("#word");
const timerTime = document.querySelector(".timer__time");

const WHITE = "#f2f2eb";
const HIDDEN_CLASS = "hidden";

let roundTime = null;
let roundTimer = null;

const startRoundTimer = () => {
  if (roundTime < 0) {
    clearInterval(roundTimer);
    getSocket().emit(window.events.startRound);
    return;
  }
  const minutes = Math.floor(roundTime / 6000);
  const seconds = Math.floor((roundTime % 6000) / 100);
  const digit = roundTime % 100;
  console.log(roundTime, minutes, seconds, digit);
  timerTime.innerText = `${minutes}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(digit).padStart(2, "0")}`;
  roundTime--;
};

export const handleStartRound = () => {
  disableCanvas();
  enableChat();
  wordDiv.classList.add(HIDDEN_CLASS);
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN_CLASS));
  roundTime = 9000;
  roundTimer = setInterval(startRoundTimer, 10);
};

export const handleStartPaint = ({ word }) => {
  enableCanvas();
  disableChat();
  wordDiv.classList.remove(HIDDEN_CLASS);
  wordSpan.innerText = word;
};

export const handleShowAnswer = ({ word }) => {};