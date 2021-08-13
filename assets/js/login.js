import { initSocket } from "./sockets";

const logoutBtn = document.querySelector(".logout");
const loginForm = document.getElementById("loginForm");
const nicknamediv = document.querySelector(".nickname");

const NICKNAME = "nickname";
const LOGGED_IN = "logged-in";
const LOGGED_OUT = "logged-out";

const login = (nickname) => {
  document.body.className = LOGGED_IN;
  nicknamediv.innerText = nickname;
  const socket = io();
  socket.emit(window.events.setNickname, { nickname });
  initSocket(socket);
};

const logout = () => {
  localStorage.clear();
  location.reload();
};

const onFormSubmit = (event) => {
  event.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  login(value);
};

const nickname = localStorage.getItem(NICKNAME);

if (nickname) {
  login(nickname);
} else {
  document.body.className = LOGGED_OUT;
}

logoutBtn.addEventListener("click", logout);

if (loginForm) {
  loginForm.addEventListener("submit", onFormSubmit);
}
