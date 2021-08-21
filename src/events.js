const events = {
  // player
  disconnect: "disconnect",
  enterUser: "enterUser",
  fullUser: "fullUser",
  leaveUser: "leaveUser",
  loginUser: "loginUser",
  logoutUser: "logoutUser",
  // paint
  fillCanvas: "fillCanvas",
  filledCanvas: "filledCanvas",
  receivePath: "receivePath",
  receiveStroke: "receiveStroke",
  sendPath: "sendPath",
  sendStroke: "sendStroke",
  // chat
  sendMsg: "sendMessage",
  submitMsg: "submitMessage",
  // game
  paintWord: "paintWord",
  readyGame: "readyGame",
  startGame: "startGame",
  startNewRound: "startNewRound",
};

export default events;
