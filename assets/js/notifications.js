const notifications = document.querySelector(".notifications");

const USER_IN = "notification--user-in";
const USER_OUT = "notification--user-out";

const showNotification = (text, theme) => {
  const notification = document.createElement("div");
  notification.innerText = text;
  notification.classList.add(theme);
  notifications.appendChild(notification);
};

export const handleNewUser = ({ nickname }) =>
  showNotification(`${nickname} just joined!!`, USER_IN);

export const handleDisconnectedUser = ({ nickname }) =>
  showNotification(`${nickname} just left!!`, USER_OUT);

export const handleFullUser = () => showNotification("Full USER!!!", USER_OUT);
