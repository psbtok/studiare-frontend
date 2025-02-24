import { useState, useEffect, useRef } from 'react';
import * as device from 'expo-device';
import * as notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Colors } from '@/styles/Colors';

export interface PushNotificationState {
    notification?: notifications.Notification;
    expoPushToken?: notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
    notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        notifications.Notification | undefined
    >();

    const notificationsListener = useRef<notifications.EventSubscription>();
    const responseListener = useRef<notifications.EventSubscription>();

    async function registerForPushNotificationsAsync() {
        let token;

        if (device.isDevice) {
            const { status: existingStatus } = await notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get the push token');
                return;
            }

            token = await notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            if (Platform.OS === 'android') {
                notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: notifications.AndroidImportance.LOW,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: Colors.skyBlue,
                });
            }

            return token;
        } else {
            console.log('Error: Use a physical device');
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        notificationsListener.current = notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        responseListener.current = notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        // Set interval to send a blank notification every minute
        const intervalId = setInterval(async () => {
            await notifications.scheduleNotificationAsync({
                content: {
                    title: "Hello!", // You can customize the title if needed
                    body: "This is a blank notification.",
                },
                trigger: {
                    seconds: 6, // Trigger immediately
                },
            });
        }, 6000); // 60000 milliseconds = 1 minute

        return () => {
            clearInterval(intervalId); // Clean up interval on unmount
            notifications.removeNotificationSubscription(notificationsListener.current!);
            notifications.removeNotificationSubscription(responseListener.current!);
        };
    }, []);

    return {
        expoPushToken,
        notification,
    };
};
