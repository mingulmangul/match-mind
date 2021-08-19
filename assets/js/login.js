import { getSocket, initSocket } from "./sockets";

const logoutBtn = document.querySelector(".logout");
const loginForm = document.getElementById("loginForm");

const LOGGED_IN = "logged-in";
// const LOGGED_OUT = "logged-out";
// const NICKNAME = "nickname";

const login = (nickname) => {
  document.body.className = LOGGED_IN;
  const socket = io();
  socket.emit(window.events.loginUser, { nickname });
  initSocket(socket);
};

const logout = () => {
  getSocket().emit(window.events.logoutUser);
  location.reload();
};

const onLoginFormSubmit = (event) => {
  event.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  login(value);
};

// const nickname = localStorage.getItem(NICKNAME);

// if (nickname) {
//   login(nickname);
// } else {
//   document.body.className = LOGGED_OUT;
// }

if (loginForm) {
  loginForm.addEventListener("submit", onLoginFormSubmit);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
