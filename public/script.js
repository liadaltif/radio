const audio = document.getElementById("radioPlayer");
const buttons = document.querySelectorAll(".station-btn");
const volumeSlider = document.getElementById("volumeSlider");

let currentButton = null;
let currentStation = null;
let metadataInterval = null;

function clearMetadataInterval() {
  if (metadataInterval) {
    clearInterval(metadataInterval);
    metadataInterval = null;
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const station = button.getAttribute("data-stream");
    const isSame = currentButton === button;

    // הסר את המחלקה active מכל הכפתורים
    buttons.forEach(btn => btn.classList.remove("active"));

    if (isSame && !audio.paused) {
      audio.pause();
      audio.src = "";
      clearMetadataInterval();
      currentButton = null;
      currentStation = null;
    } else {
      if (!audio.paused) {
        audio.pause();
        clearMetadataInterval();
      }
      audio.src = `/stream/${station}`;
      audio.play().catch(err => alert("שגיאה בהשמעה: " + err.message));
      button.classList.add("active");
      currentButton = button;
      currentStation = station;
    }
  });
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("seeking", () => {
  audio.currentTime = audio.duration || 0;
});
