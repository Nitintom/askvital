// Notification store (holds pending notifications)
const notifications = [];

// Notify the admin about a new business submission
export const notifyAdmin = (businessSubmission) => {
  console.log(
    `Admin Notification: New business submission received - ${businessSubmission.name}`
  );
  notifications.push({
    id: notifications.length + 1,
    message: `New business submission - ${businessSubmission.name}`,
  });
};

// Notify the user about the approval or denial of their submission
export const notifyUser = (businessSubmission) => {
  if (businessSubmission.status === "Approved") {
    console.log(
      `User Notification: Your business submission for "${businessSubmission.name}" has been approved.`
    );
    notifications.push({
      id: notifications.length + 1,
      message: `Your business submission for "${businessSubmission.name}" has been approved.`,
    });
  } else if (businessSubmission.status === "Denied") {
    console.log(
      `User Notification: Your business submission for "${businessSubmission.name}" has been denied.`
    );
    notifications.push({
      id: notifications.length + 1,
      message: `Your business submission for "${businessSubmission.name}" has been denied.`,
    });
  }
};

// Get pending notifications
export const getPendingNotifications = () => {
  return notifications;
};

// Remove a notification by ID
export const removeNotificationById = (notificationId) => {
  const index = notifications.findIndex(
    (notification) => notification.id === notificationId
  );
  if (index !== -1) {
    notifications.splice(index, 1);
  }
};
