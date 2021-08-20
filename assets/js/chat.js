import { getSocket } from "./sockets";

const chatForm = document.querySelector(".chat-form");

const HIDDEN = "hidden";

let msgTimer = null;

export const handleSendMsg = ({ text, playerNum }) =>
  showNewMsg(text, playerNum);

const showNewMsg = (text, playerNum) => {
  const speaker = document.querySelector(
    `.player[data-playerNum=\"${playerNum}\"]`
  );
  const chatDiv = speaker.querySelector(".player__chat");
  chatDiv.innerText = text;
  if (msgTimer) {
    clearTimeout(msgTimer);
  }
  chatDiv.classList.remove(HIDDEN);
  msgTimer = setTimeout(() => chatDiv.classList.add(HIDDEN), 4000);
};

const handleChatSubmit = (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const { value } = input;
  input.value = "";
  getSocket().emit(window.events.submitMsg, { text: value });
};

chatForm.addEventListener("submit", handleChatSubmit);
