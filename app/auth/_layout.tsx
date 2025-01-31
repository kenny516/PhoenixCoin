import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack 
            screenOptions={{ 
                headerShown: false,
                animation: 'slide_from_right',
                statusBarStyle: 'dark',
                statusBarTranslucent: true
            }}>
            <Stack.Screen 
                name="sign-in" 
                options={{
                    title: 'Connexion',
                    animation: 'slide_from_right'
                }}
            />
            <Stack.Screen 
                name="sign-up"
                options={{
                    title: 'Inscription',
                    animation: 'slide_from_right'
                }}
            />
        </Stack>
    );
}
