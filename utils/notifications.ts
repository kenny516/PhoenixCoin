import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function setupNotifications() {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return true;
    } catch (error) {
        console.error('Error setting up notifications:', error);
        return false;
    }
}

export async function sendPriceChangeNotification(
    cryptoName: string,
    changePercentage: number,
    customMessage?: string
) {
    try {
        const message = customMessage ||
            `${cryptoName}: ${changePercentage >= 0 ? '↗️' : '↘️'} ${Math.abs(changePercentage).toFixed(2)}%`;

        const notificationContent = {
            title: 'Alerte Crypto',
            body: message,
            data: { cryptoName },
        };

        await Notifications.scheduleNotificationAsync({
            content: notificationContent,
            trigger: null,
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}
