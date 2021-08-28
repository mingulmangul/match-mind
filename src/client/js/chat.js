import { getSocket } from "./sockets";

const chatForm = document.querySelector(".chat-form");
const input = chatForm.querySelector("input");

const HIDDEN_CLASS = "hidden";
const DISABLED = "disabled";

let msgTimer = null;

const showNewMsg = (text, playerNum) => {
  const speaker = document.querySelector(
    `.player[data-playerNum=\"${playerNum}\"]`
  );
  const chatDiv = speaker.querySelector(".player__chat");
  chatDiv.innerText = text;
  if (msgTimer) {
    clearTimeout(msgTimer);
  }
  chatDiv.classList.remove(HIDDEN_CLASS);
  msgTimer = setTimeout(() => chatDiv.classList.add(HIDDEN_CLASS), 4000);
};

const handleChatSubmit = (event) => {
  event.preventDefault();
  const { value } = input;
  input.value = "";
  getSocket().emit(window.events.submitMsg, { text: value });
};

export const enableChat = () => {
  input.removeAttribute(DISABLED);
};

export const disableChat = () => {
  input.setAttribute(DISABLED, "");
};

export const handleSendMsg = ({ text, playerNum }) =>
  showNewMsg(text, playerNum);

chatForm.addEventListener("submit", handleChatSubmit);
