import { fill } from "./paint";

const chatDivs = document.querySelectorAll(".player__chat");
const wordDiv = document.querySelector("#word");

const WHITE = "#f2f2eb";
const HIDDEN = "hidden";

export const handlePaintWord = ({ word }) => {
  fill(WHITE);
  chatDivs.forEach((chatDiv) => chatDiv.classList.add(HIDDEN));
  wordDiv.innerText = word;
};
