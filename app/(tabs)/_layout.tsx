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
            <Stack.Screen name='content' options={{ title: 'content' }} />
        </Stack>
    );
}