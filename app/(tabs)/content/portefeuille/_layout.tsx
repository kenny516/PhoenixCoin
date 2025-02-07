import { Stack } from 'expo-router'
import React from 'react'

export default function layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'portefeuille'
                }}
            />
            <Stack.Screen
                name="transaction"
                options={{
                    title: 'transaction'
                }}
            />
        </Stack>
    )
}
