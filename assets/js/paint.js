import iro from "@jaames/iro";
import html2canvas from "html2canvas";
import { getSocket } from "./sockets";

const controls = document.querySelector(".paint__controls");
const currentColor = document.querySelector(".color--current");
const blackBtn = document.querySelector(".color--black");
const whiteBtn = document.querySelector(".color--white");
const fillBtn = document.querySelector("#fillBtn");
const saveBtn = document.querySelector(".save-btn");
const eraserBtn = document.querySelector("#eraserBtn");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const BLACK = "#031b29";
const WHITE = "#f2f2eb";
const DISABLE_CLASS = "disable";

ctx.strokeStyle = BLACK;
ctx.fillStyle = BLACK;
ctx.lineWidth = 4;

let painting = false;
let filling = false;

const startPainting = () => (painting = true);
const stopPainting = () => (painting = false);

const getCurrentColor = () => currentColor.style.backgroundColor;
const setCurrentColor = (color) => (currentColor.style.backgroundColor = color);

const handleColorChange = (event) => {
  const color = event.rgbString || event.target.style.backgroundColor;
  setCurrentColor(color);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

const showPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const showStroke = (x, y, color) => {
  if (color) {
    ctx.strokeStyle = color;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = getCurrentColor();
};

export const fill = (color) => {
  if (color) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getCurrentColor();
};

const handleMouseMove = (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    showPath(x, y);
    getSocket().emit(window.events.sendPath, { x, y });
  } else {
    showStroke(x, y);
    getSocket().emit(window.events.sendStroke, {
      x,
      y,
      color: getCurrentColor(),
    });
  }
};

const handleMouseDown = () => {
  if (filling) {
    fill();
    getSocket().emit(window.events.fillCanvas, {
      color: getCurrentColor(),
    });
  } else {
    startPainting();
  }
};

const handleFillBtnClick = () => {
  if (filling) {
    filling = false;
    fillBtn.innerText = "채우기";
  } else {
    filling = true;
    fillBtn.innerText = "그리기";
  }
};

const handleCanvasCM = (event) => event.preventDefault();

const handleSaveBtnClick = () => {
  html2canvas(document.body).then(function (image) {
    const saveLink = document.createElement("a");
    saveLink.href = image.toDataURL();
    saveLink.download = "matchmind_screenshot";
    saveLink.click();
  });
};

const handleEraserBtnClick = () => {
  fill(WHITE);
  getSocket().emit(window.events.fillCanvas, {
    color: WHITE,
  });
};

export const enableCanvas = () => {
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  blackBtn.addEventListener("click", handleColorChange);
  whiteBtn.addEventListener("click", handleColorChange);
  fillBtn.addEventListener("click", handleFillBtnClick);
  eraserBtn.addEventListener("click", handleEraserBtnClick);
  controls.classList.remove(DISABLE_CLASS);
};

export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  blackBtn.removeEventListener("click", handleColorChange);
  whiteBtn.removeEventListener("click", handleColorChange);
  fillBtn.removeEventListener("click", handleFillBtnClick);
  eraserBtn.removeEventListener("click", handleEraserBtnClick);
  controls.classList.add(DISABLE_CLASS);
};

export const handleReceivePath = ({ x, y }) => showPath(x, y);
export const handleReceiveStroke = ({ x, y, color }) => showStroke(x, y, color);
export const handleFilledCanvas = ({ color }) => fill(color);

if (canvas) {
  const colorPicker = new iro.ColorPicker(".color-picker", {
    width: 200,
    color: "rgb(255, 0, 0)",
    layout: [
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "hue",
        },
      },
    ],
  });
  colorPicker.on("color:change", handleColorChange);

  setCurrentColor(BLACK);
  enableCanvas();
  canvas.addEventListener("contextmenu", handleCanvasCM);
  saveBtn.addEventListener("click", handleSaveBtnClick);
}
