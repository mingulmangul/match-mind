import { handleSendMsg } from "./chat";
import {
  handleReceiveTime,
  handleShowAnswer,
  handleStartPaint,
  handleStartRound,
} from "./game";
import { handleFullUser, handleReadyGame } from "./notifications";
import {
  handleFilledCanvas,
  handleReceivePath,
  handleReceiveStroke,
} from "./paint";
import { handleEnterUser, handleLeaveUser } from "./players";

let socket = null;

export const getSocket = () => socket;

export const initSocket = (newSocket) => {
  const { events } = window;
  socket = newSocket;

  // player
  socket.on(events.fullUser, handleFullUser);
  socket.on(events.enterUser, handleEnterUser);
  socket.on(events.leaveUser, handleLeaveUser);

  // paint
  socket.on(events.filledCanvas, handleFilledCanvas);
  socket.on(events.receivePath, handleReceivePath);
  socket.on(events.receiveStroke, handleReceiveStroke);

  // chat
  socket.on(events.sendMsg, handleSendMsg);

  // game;
  socket.on(events.readyGame, handleReadyGame);
  socket.on(events.receiveTime, handleReceiveTime);
  socket.on(events.startGame, handleStartRound);
  socket.on(events.startPaint, handleStartPaint);
  socket.on(events.showAnswer, handleShowAnswer);
};
