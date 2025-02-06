import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBarManager } from '@/components/StatusBarManager';
import 'react-native-url-polyfill/auto';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getMessaging, getToken } from "firebase/messaging";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


const messaging = getMessaging();

const getFCMToken = async () => {
    try {
        const fcmToken = await getToken(messaging, { vapidKey: "YOUR_FCM_VAPID_KEY" });
        alert("fccc" + fcmToken);
        console.log("FCM Token:", fcmToken);
        return fcmToken;
    } catch (error) {
        console.error("Erreur lors de la récupération du token FCM :", error);
    }
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getDevicePushTokenAsync()).data;
        console.log('push token', token);
        alert(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {

        if (loaded) {
            SplashScreen.hideAsync();
        }
        registerForPushNotificationsAsync();
        const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification reçue !', notification);
            // Gère la notification reçue, par exemple, mets à jour l'état de l'application
        });
    }, [loaded]);

    if (!loaded) {
        return null;
    }



    return (
        <>
            <StatusBarManager />
            <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
                        animation: 'slide_from_bottom',
                    }}>
                    <Stack.Screen name="auth" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </View>
        </>
    );
}