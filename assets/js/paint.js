import iro from "@jaames/iro";
import html2canvas from "html2canvas";
import { getSocket } from "./sockets";

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
    getSocket().emit(window.events.sendPath, { x, y });
  } else {
    getSocket().emit(window.events.sendStroke, {
      x,
      y,
      color: getCurrentColor(),
    });
  }
};

const handleMouseDown = () => {
  if (filling) {
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
  getSocket().emit(window.events.fillCanvas, {
    color: WHITE,
  });
};

export const handleReceivePath = ({ x, y }) => showPath(x, y);

export const handleReceiveStroke = ({ x, y, color }) => showStroke(x, y, color);

export const handleFilledCanvas = ({ color }) => fill(color);

if (canvas) {
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("contextmenu", handleCanvasCM);

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
  blackBtn.addEventListener("click", handleColorChange);
  whiteBtn.addEventListener("click", handleColorChange);
  fillBtn.addEventListener("click", handleFillBtnClick);
  saveBtn.addEventListener("click", handleSaveBtnClick);
  eraserBtn.addEventListener("click", handleEraserBtnClick);
}
