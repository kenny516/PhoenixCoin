import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

export function StatusBarManager() {
    const colorScheme = useColorScheme();

    return (
        <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
            backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
        />
    );
}
