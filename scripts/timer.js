/*
  Module to provide timer countdown and reset functionality
*/

export class Timer {
  
  // Private variable declarations
  #intervalInMinutes;
  #remainingTime;
  #isRunning;
  #timerId;

  constructor(intervalInMinutes) {
    this.#intervalInMinutes = intervalInMinutes;
    this.#remainingTime = intervalInMinutes * 60;
    this.#isRunning = false;
    this.#timerId = null;
  }

  getInitialTime() {
    return this.#intervalInMinutes;
  }

  startTimer(onTick, onFinish) {
    this.#timerId = setInterval(() => {
      this.#decrementTimer(onFinish);
      onTick();
    }, 1000);
    this.#isRunning = true;
  }

  updateIntervalInMinutes(minutes) {
    this.#intervalInMinutes = minutes;
  }

  pauseTimer() {
    clearInterval(this.#timerId);
    this.#isRunning = false;
  }

  isPaused() {
    return this.#isRunning == false;
  }

  resetTimer() {
    this.#isRunning = false;
    this.#remainingTime = this.#intervalInMinutes * 60;
  }

  getTimeFormatted() {
    let minutes = `${Math.floor(this.#remainingTime / 60)}`;
    let seconds = `${this.#remainingTime % 60}`;
    return `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
  }

  #decrementTimer(onFinish) {
    try {
      if (this.#remainingTime <= 0) {
        clearInterval(this.#timerId);
        console.log("Timer has ended!")
        onFinish();
        return;
      }
      this.#remainingTime = this.#remainingTime - 1;
    } catch (error) {
      console.error(error);
    }
  }
};