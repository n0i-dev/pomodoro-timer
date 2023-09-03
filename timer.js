/*
  Module to provide timer countdown and reset functionality
*/

// Module-level timer state
const timerState = {
  InitialTime: localStorage.getItem("startingTimeInMinutes") * 60 ?? (25 * 60),
  RemainingTime: initializeRemainingTime(),
  IsPaused: true,
  TimerId: null
};

export function getInitialTime() {return timerState.InitialTime}

export function isPaused() {return timerState.IsPaused; }

export function startTimer(onTick, onFinish) {
  timerState.TimerId = setInterval(() => {
    decrementTimer(onFinish);
    onTick();
  }, 1000);
  timerState.IsPaused = false;
}

export function pauseTimer() {
  clearInterval(timerState.TimerId);
  timerState.IsPaused = true;
}

export function setInitialTime(minutes) {
  localStorage.setItem("startingTimeInMinutes", minutes);
  timerState.InitialTime = minutes * 60;
}

export function resetTimer() {
  localStorage.setItem("remainingTimeInSeconds", timerState.InitialTime);
  timerState.RemainingTime = timerState.InitialTime;
}

// Format the number of seconds left for the timer in minutes and seconds
export function getTimeFormatted() {
  let minutes = `${Math.floor(timerState.RemainingTime / 60)}`;
  let seconds = `${timerState.RemainingTime % 60}`;
  return `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
}

function decrementTimer(onFinish) {
  try {
    if (timerState.RemainingTime <= 0) {
      clearInterval(timerState.TimerId);
      console.log("Timer has ended!")
      onFinish();
      return;
    }
    timerState.RemainingTime = timerState.RemainingTime - 1;
    localStorage.setItem("remainingTimeInSeconds", timerState.RemainingTime);
  } catch (error) {
    console.error(error);
  }
}

function initializeRemainingTime() {
  let remainingTimeSetting = localStorage.getItem("remainingTimeInSeconds");
  if (remainingTimeSetting === null || isNaN(remainingTimeSetting)) {
    return localStorage.getItem("startingTimeInMinutes") ?? (25 * 60);
  }
  return remainingTimeSetting;
}