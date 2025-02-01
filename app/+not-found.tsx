import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oups!' }} />
            <ThemedView style={styles.container}>
                <ThemedText type="title">Cette page n'existe pas.</ThemedText>
                <Link href="/" style={styles.link}>
                    <ThemedText type="link">Retourner à l'accueil!</ThemedText>
                </Link>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
