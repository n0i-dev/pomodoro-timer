if (!("Notification" in window)) {
  console.log("This browser does not support notifications.");
} else {
  await Notification.requestPermission();
}

export function notifyUser(title, message) {
  if (Notification?.permission == "granted") createNotification(title, message);
  else if (Notification?.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        createNotification(title, message);
      }
    });
  }
}

function createNotification(title, message) {
  const notif = new Notification(title, { body: message });
  notif.addEventListener("click", () => {
    notif.close();
  });
}
