import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom',
            }}>
            <Stack.Screen name="index" options={{ title: "landingPage" }} />
            <Stack.Screen name="explore" options={{ title: "explorer" }} />
            <Stack.Screen name="profile" options={{ title: "profil" }} />
        </Stack>
    );
}