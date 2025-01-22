import * as Notifications from 'expo-notifications';

export const scheduleNotification = async () => {
  // Get the current time and add 30 seconds to it
  const triggerTime = new Date(Date.now() + 5 * 1000); // 30 seconds from now
  console.log('hello')
  // Schedule a notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: "This is a scheduled notification.",
      data: { customData: 'Some custom data' }, // Optional: You can pass custom data
    },
    trigger: {
      date: triggerTime, // Set the trigger time to 30 seconds from now
    },
  });

  // Log the notification ID and scheduled time
  console.log(`Scheduled notification with ID: ${notificationId} at ${triggerTime}`);
};
