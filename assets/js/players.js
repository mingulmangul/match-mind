const showPlayers = (players) => {
  const playerRooms = document.querySelectorAll(".player");
  players.forEach((player) => {
    const { playerNum, nickname, score } = player;
    const playerRoom = playerRooms[playerNum];
    playerRoom.setAttribute("data-playerNum", playerNum);
    const nicknameDiv = playerRoom.querySelector(".nickname");
    nicknameDiv.innerText = nickname;
    const scoreDiv = playerRoom.querySelector(".score");
    scoreDiv.innerText = score;
    const gradeDiv = playerRoom.querySelector(".player__grade");
    gradeDiv.innerText = "F";
  });
};

const deletePlayer = (playerNum) => {
  const playerRoom = document.querySelector(
    `.player[data-playerNum=\"${playerNum}\"]`
  );
  const nicknamediv = playerRoom.querySelector(".nickname");
  nicknamediv.innerText = "";
  const grade = playerRoom.querySelector(".player__grade");
  grade.innerText = "";
  const score = playerRoom.querySelector(".score");
  score.innerText = "";
};

export const handleEnterUser = ({ players }) => showPlayers(players);
export const handleLeaveUser = ({ playerNum }) => deletePlayer(playerNum);

export const highLightPainter = (playerNum) => {
  const playerRoom = document.querySelector(
    `.player[data-playerNum=\"${playerNum}\"]`
  );
  playerRoom.classList.toggle("painter");
};
