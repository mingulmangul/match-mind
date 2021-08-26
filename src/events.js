const events = {
  // event config
  time: 4000,
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
  endRound: "endRound",
  readyGame: "readyGame",
  receiveTime: "receiveTime",
  sendTime: "sendTime",
  showAnswer: "showAnswer",
  showPainter: "showPainter",
  showRank: "showRank",
  startRound: "startRound",
  startPaint: "startPaint",
};

export default events;
