import { fill } from "./paint";
import { getSocket } from "./sockets";

const chatDivs = document.querySelectorAll(".player__chat");
const wordDiv = document.querySelector("#word");
const timerDiv = document.querySelector(".timer");
const timerTime = timerDiv.querySelector(".timer__time");

const WHITE = "#f2f2eb";
const HIDDEN = "hidden";

let roundTime = null;
let roundTimer = null;

const startRoundTimer = () => {
  if (roundTime < 0) {
    clearInterval(roundTimer);
    getSocket().emit(window.events.startNewRound);
  }
  const minutes = Math.floor(roundTime / 60);
  const seconds = roundTime % 60;
  console.log(roundTime, minutes, seconds);
  timerTime.innerText = `${minutes}:${seconds}`;
  roundTime--;
};

export const handlePaintWord = ({ word }) => {
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN));
  wordDiv.innerText = word;
  roundTime = 90;
  roundTimer = setInterval(startRoundTimer, 1000);
};
