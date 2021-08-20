import { getSocket } from "./sockets";

const notification = document.querySelector(".notification");
const notice = notification.querySelector("p");

const HIDDEN = "hidden";

let countTimer = null;
let count = null;

const showNotification = (text) => {
  notification.classList.remove(HIDDEN);
  notice.innerText = text;
};

const startCountTimer = () => {
  if (count < 1) {
    notification.classList.add(HIDDEN);
    clearInterval(countTimer);
    getSocket().emit(window.events.startGame);
    return;
  }
  showNotification(`${count--}초 후에 게임이 시작됩니다.`);
};

export const handleFullUser = () => showNotification("방이 가득 찼습니다.");

export const handleReadyGame = ({ gamePlaying }) => {
  count = 15;
  if (countTimer) {
    clearInterval(countTimer);
  }
  if (gamePlaying) {
    countTimer = setInterval(startCountTimer, 1000);
  } else {
    showNotification("2명 이상의 플레이어가 모이면 게임을 시작합니다.");
  }
};
