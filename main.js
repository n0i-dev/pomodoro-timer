import * as timer from "./timer.js";
import * as notifications from "./notifications.js"
const NOTIIFCATION_TITLE = "n0i | Pomodoro Timer";
const mainButton = document.getElementById("main-button");
const resetButton = document.getElementById("reset") ;
const timerSection = document.getElementById("timer");
const settingsButton = document.getElementById("settings");
const timerInput = document.getElementById("timer-length");
const breakTimerInput = document.getElementById("break-timer-length");
const modal = document.querySelector(".modal");
let workTabSelected = true;

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
  if (workTabSelected) {
    timer.setInitialTime(event.target.value);
    timer.resetTimer();
    timerSection.innerHTML = timer.getTimeFormatted();
  }
});

breakTimerInput.value = Math.floor(getBreakTimeLength());
breakTimerInput.addEventListener("input", (event) => {
  localStorage.setItem("breakLengthInMinutes", event.target.value);

  if (!workTabSelected) {
    timer.setInitialTime(event.target.value);
    timer.resetTimer();
    timerSection.innerHTML = timer.getTimeFormatted();
  }
});

document.querySelectorAll("ul > li").forEach((element) => {
  onTabClick(element);
});

function onTabClick(element) {
  element.addEventListener("click", () => {
    let innerText = element.firstElementChild.textContent;
    pauseTimer("Start");
    workTabSelected = innerText == "Work";

    if (innerText == "Work") {
      timer.setInitialTime(timerInput.value);
    }
    else {
      timer.setInitialTime(getBreakTimeLength());
    }

    timer.resetTimer();
    timerSection.innerHTML = timer.getTimeFormatted();
    document.querySelectorAll("ul > li.is-active").forEach((element) => element.classList.remove("is-active"));
    element.classList.add("is-active");
  });
}

function getBreakTimeLength() {
  return localStorage.getItem("breakLengthInMinutes") ?? 5;
}

function startTimer() {
  console.log("Timer has started!");
  timer.startTimer(
    () => timerSection.innerHTML = timer.getTimeFormatted(),
    onTimerFinish);
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

function onTimerFinish() {
  notifications.notifyUser(NOTIIFCATION_TITLE, "Your timer is finished!");
  resetTimer();
}