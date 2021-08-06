const loginForm = document.getElementById("loginForm");

const NICKNAME = "nickname";
const LOGGED_IN = "logged-in";
const LOGGED_OUT = "logged-out";

const login = (nickname) => {
  document.body.className = LOGGED_IN;
  window.socket = io();
  window.socket.emit(window.events.setNickname, { nickname });
};

const nickname = localStorage.getItem(NICKNAME);

if (nickname) {
  login(nickname);
} else {
  document.body.className = LOGGED_OUT;
}

const onFormSubmit = (event) => {
  event.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  input.value = "";
  localStorage.setItem(NICKNAME, value);
  login(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", onFormSubmit);
}
