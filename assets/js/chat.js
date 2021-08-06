import { getSocket } from "./sockets";

const chat = document.querySelector(".chat");
const chatForm = document.querySelector("#chatForm");

export const handleSendMsg = ({ text, nickname }) => {
  showNewMsg(text, nickname);
};

const showNewMsg = (text, nickname) => {
  const speaker = nickname || "You";
  const msg = document.createElement("li");
  msg.innerHTML = `<span class="speaker ${
    nickname ? "speaker--other" : "speaker--self"
  }">${speaker}</span>${text}`;
  chat.appendChild(msg);
};

const handleChatSubmit = (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const { value } = input;
  input.value = "";
  showNewMsg(value);
  getSocket().emit(window.events.submitMsg, { text: value });
};

chatForm.addEventListener("submit", handleChatSubmit);
