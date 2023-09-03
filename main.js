
const mainButton = document.getElementById("main-button");
const resetButton = document.getElementById("reset") ;
const timerSection = document.getElementById("timer");
const timerState = {
  InitialTime: localStorage.getItem("timerLengthSetting") ?? (25 * 60),
  RemainingTime: initializeRemainingTime(),
  IsPaused: true,
  TimerId: null
};

timerSection.innerHTML = getTimeFormatted();

mainButton.addEventListener("click", () => {
  if (timerState.IsPaused)
  {
    startTimer(timerState.RemainingTime);
    return;
  }
  pauseTimer("Resume");
});

resetButton.addEventListener("click", resetTimer);

function startTimer(minutes) {
  console.log("Timer has started!");
  timerState.TimerId = setInterval(decrementTimer, 1000, minutes);
  timerState.IsPaused = false;
  mainButton.innerHTML = "Pause"
}

function pauseTimer(afterPauseText) {
  console.log("Timer has been paused!");
  clearInterval(timerState.TimerId);
  timerState.IsPaused = true;
  mainButton.innerHTML = afterPauseText;
}

function resetTimer() {
  pauseTimer("Start");
  localStorage.setItem("remainingTimeInSeconds", timerState.InitialTime);
  timerState.RemainingTime = timerState.InitialTime;
  timerSection.innerHTML = getTimeFormatted();
}

function decrementTimer(minutesSet) {
  console.log("Timer running!")
  timerState.RemainingTime = timerState.RemainingTime - 1;
  try {
    timer.innerHTML = getTimeFormatted();
    localStorage.setItem("remainingTimeInSeconds", timerState.RemainingTime);
    if (timerState.RemainingTime == 0) {
      clearInterval(timerState.TimerId);
      console.log("Timer has ended!")
    }
  } catch (error) {
    console.error(error);
  }
}

function getTimeFormatted() {
  console.log(timerState.RemainingTime)
  let minutes = `${Math.floor(timerState.RemainingTime / 60)}`;
  let seconds = `${timerState.RemainingTime % 60}`;
  return `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
}

function initializeRemainingTime() {
  let remainingTimeSetting = localStorage.getItem("remainingTimeInSeconds");
  if (remainingTimeSetting === null || isNaN(remainingTimeSetting)) {
    return localStorage.getItem("timerLengthSetting") ?? (25 * 60);
  }
  return remainingTimeSetting;
}