import iro from "@jaames/iro";

const chosen = document.querySelector(".color--chosen");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "#031b29";
let painting = false;

const onColorChange = (color) => {
  chosen.style.backgroundColor = color.rgbString;
  ctx.strokeStyle = color.rgbString;
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
  colorPicker.on("color:change", onColorChange);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
}
