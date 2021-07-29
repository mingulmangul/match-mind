// eslint-disable-next-line no-undef
const socket = io();

const sendMessage = (message) => {
  socket.emit("newMessage", { message });
  console.log(`You: ${message}`);
};

socket.on("messageNotif", ({ message, nickname }) => {
  console.log(`${nickname}: ${message}`);
});

const setNickname = (nickname) => {
  socket.emit("setNickname", { nickname });
};
