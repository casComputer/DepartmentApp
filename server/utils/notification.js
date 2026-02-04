import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(pushToken, title, body) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('Invalid Expo push token');
    return;
  }

  const messages = [{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data: { extra: 'anything you want' },
  }];

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error(error);
    }
  }
}