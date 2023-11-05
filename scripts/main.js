import * as timer from "./timer.js";
import * as notifications from "./notifications.js"
const PAGE_TITLE = "n0i | Pomodoro Timer";
const TIMER_FINISH_TITLE = "n0i | Timer's finished!";
const mainButton = document.getElementById("main-button");
const timerSection = document.getElementById("timer");
const settingsButton = document.getElementById("settings");
const modal = document.querySelector(".modal");
let timerFinishIntervalId = null;

class TimerGrouping {
  constructor(inputElement, configurationKey, defaultTimerLength) {
    this.timer = new timer.Timer(localStorage.getItem(configurationKey) ?? defaultTimerLength);
    this.inputElement = inputElement;
    this.localStorageKey = configurationKey;
  }

  initializeTimer() {
    this.timer.updateIntervalInMinutes(this.inputElement.value);
    this.timer.resetTimer();
  }
}

const pomodoroTimerGroups = {
  work: new TimerGrouping(document.getElementById("timer-length"), "workTimeIntervalInMinutes", 25),
  break: new TimerGrouping(document.getElementById("break-timer-length"), "breakTimeIntervalInMinutes", 5)
};

let selectedGroup = pomodoroTimerGroups.work;
timerSection.innerHTML = selectedGroup.timer.getTimeFormatted();

mainButton.addEventListener("click", () => {
  if (selectedGroup.timer.isPaused()) {
    startTimer();
    return;
  }
  pauseTimer("Resume");
});

settingsButton.addEventListener("click", () => {
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

document.getElementById("reset").addEventListener("click", resetTimer);
settingsButton.addEventListener("click", () => {pauseTimer((mainButton.innerHTML.includes("Start")) ? "Start" : "Resume")});

[pomodoroTimerGroups.work, pomodoroTimerGroups.break].forEach(group => {
  group.inputElement.value = group.timer.getInitialTime();
  group.inputElement.addEventListener("input", (event) => {
    group.timer.updateIntervalInMinutes(event.target.value);
    localStorage.setItem(group.localStorageKey, event.target.value);
    group.timer.resetTimer();
    if (selectedGroup === group)
      timerSection.innerHTML = group.timer.getTimeFormatted();
  })
});

document.querySelectorAll("ul > li").forEach((element) => {
  onTabClick(element);
});

window.addEventListener("focus", () => {
  if (timerFinishIntervalId != null)
  {
    clearInterval(timerFinishIntervalId);
    document.title = PAGE_TITLE;
    timerFinishIntervalId = null;
  }
});

function onTabClick(element) {
  element.addEventListener("click", () => {
    let innerText = element.firstElementChild.textContent;
    pauseTimer("Start");

    if (innerText == "Work") {
      selectedGroup = pomodoroTimerGroups.work;
    }
    else if (innerText == "Break") {
      selectedGroup = pomodoroTimerGroups.break;
    }

    selectedGroup.initializeTimer();
    timerSection.innerHTML = selectedGroup.timer.getTimeFormatted();
    document.querySelectorAll("ul > li.is-active").forEach((element) => element.classList.remove("is-active"));
    element.classList.add("is-active");
  });
}

function startTimer() {
  selectedGroup.timer.startTimer(
    () => timerSection.innerHTML = selectedGroup.timer.getTimeFormatted(),
    onTimerFinish);
  mainButton.innerHTML = "Pause";
}

function pauseTimer(afterPauseText) {
  selectedGroup.timer.pauseTimer();
  mainButton.innerHTML = afterPauseText;
}

function resetTimer() {
  pauseTimer("Start");
  selectedGroup.timer.resetTimer();
  timerSection.innerHTML = selectedGroup.timer.getTimeFormatted();
}

function onTimerFinish() {
  notifications.notifyUser(PAGE_TITLE, "Your timer is finished!");
  resetTimer();
  timerFinishIntervalId = setInterval(switchTitles, 700);
}

function switchTitles() {
  document.title = document.title == PAGE_TITLE ? TIMER_FINISH_TITLE : PAGE_TITLE;
}