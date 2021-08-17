import iro from "@jaames/iro";
import html2canvas from "html2canvas";

const chosen = document.querySelector(".color--chosen");
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

const onColorChange = (event) => {
  const color = event.rgbString || event.target.style.backgroundColor;
  chosen.style.backgroundColor = color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

const startPainting = () => (painting = true);
const stopPainting = () => (painting = false);

const onMouseMove = (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};

const onFillBtnClick = () => {
  if (filling) {
    filling = false;
    fillBtn.innerText = "채우기";
  } else {
    filling = true;
    fillBtn.innerText = "그리기";
  }
};

const onCanvasClick = () => {
  if (filling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const onCanvasCM = (event) => event.preventDefault();

const onSaveBtnClick = () => {
  html2canvas(document.body).then(function (image) {
    const saveLink = document.createElement("a");
    saveLink.href = image.toDataURL();
    saveLink.download = "matchmind_screenshot";
    saveLink.click();
  });
};

const onEraserBtnClick = () => {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = chosen.style.backgroundColor;
};

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", onCanvasClick);
  canvas.addEventListener("contextmenu", onCanvasCM);

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
  colorPicker.on("color:change", onColorChange);
  blackBtn.addEventListener("click", onColorChange);
  whiteBtn.addEventListener("click", onColorChange);
  fillBtn.addEventListener("click", onFillBtnClick);
  saveBtn.addEventListener("click", onSaveBtnClick);
  eraserBtn.addEventListener("click", onEraserBtnClick);
}
