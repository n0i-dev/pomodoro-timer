import * as timer from "./timer.js";
const mainButton = document.getElementById("main-button");
const resetButton = document.getElementById("reset") ;
const timerSection = document.getElementById("timer");
const settingsButton = document.getElementById("settings");
const timerInput = document.getElementById("timer-length");
const modal = document.querySelector(".modal");

timerSection.innerHTML = timer.getTimeFormatted();

mainButton.addEventListener("click", () => {
  if (timer.isPaused()) {
    startTimer();
    return;
  }
  pauseTimer("Resume");
});

document.getElementById("settings").addEventListener("click", () => {
  modal.classList.add("is-active");
});

(
  document.querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot"
  ) || []
).forEach(($close) => {
  $close.addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
});

resetButton.addEventListener("click", resetTimer);
settingsButton.addEventListener("click", () => {pauseTimer("Resume")});

timerInput.value = Math.floor(timer.getInitialTime() / 60);
timerInput.addEventListener("input", (event) => {
    timer.setInitialTime(event.target.value);
    timer.resetTimer();
    timerSection.innerHTML = timer.getTimeFormatted();
});

function startTimer() {
  console.log("Timer has started!");
  timer.startTimer(() => timerSection.innerHTML = timer.getTimeFormatted());
  mainButton.innerHTML = "Pause";
}

function pauseTimer(afterPauseText) {
  console.log("Timer has been paused!");
  timer.pauseTimer();
  mainButton.innerHTML = afterPauseText;
}

function resetTimer() {
  pauseTimer("Start");
  timer.resetTimer();
  timerSection.innerHTML = timer.getTimeFormatted();
}