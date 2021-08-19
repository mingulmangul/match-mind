import { getSocket, initSocket } from "./sockets";

const logoutBtn = document.querySelector(".logout");
const loginForm = document.getElementById("loginForm");

const NICKNAME = "nickname";
const LOGGED_IN = "logged-in";
const LOGGED_OUT = "logged-out";

const login = (nickname) => {
  document.body.className = LOGGED_IN;
  const socket = io();
  socket.emit(window.events.loginUser, { nickname });
  initSocket(socket);
};

const logout = () => {
  getSocket().emit(window.events.disconnect);
  localStorage.clear();
  location.reload();
};

const onLoginFormSubmit = (event) => {
  event.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  // localStorage.setItem(NICKNAME, value);
  login(value);
};

const nickname = localStorage.getItem(NICKNAME);

if (nickname) {
  login(nickname);
} else {
  document.body.className = LOGGED_OUT;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (loginForm) {
  loginForm.addEventListener("submit", onLoginFormSubmit);
}
