const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return <div className={`${notification.type} notification`}>{notification.message}</div>;
};

export default Notification;
