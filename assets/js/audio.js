const audio = document.querySelector("audio");
const audioBtn = document.querySelector("#playAudio");

const handleAudioClick = () => {
  if (audio.paused) {
    audio.play();
    audioBtn.innerHTML = "<span>&#10074;&#10074;</span>";
  } else {
    audio.pause();
    audioBtn.innerText = "▶";
  }
};

audioBtn.addEventListener("click", handleAudioClick);
