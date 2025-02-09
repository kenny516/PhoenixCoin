import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Layout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="sign-in"
                options={{
                    title: 'Connexion'
                }}
            />
            {/*             <Stack.Screen
                name="sign-up"
                options={{
                    title: 'Inscription'
                }}
            /> */}
        </Stack>
    );
}
