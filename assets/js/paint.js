import iro from "@jaames/iro";

const canvas = document.querySelector("canvas");
const chosen = document.querySelector(".color--chosen");

let painting = false;

const onColorChange = (color) => {
  chosen.style.backgroundColor = color.rgbString;
};

const startPainting = () => (painting = true);
const stopPainting = () => (painting = false);

const onMouseMove = (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
};

if (canvas) {
  console.log("canvas");
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
