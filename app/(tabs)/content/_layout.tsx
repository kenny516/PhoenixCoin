import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Platform, Animated, Pressable } from 'react-native';
import { useMemo } from 'react';

const TabBarIcon = ({ name, color, focused }: { name: any; color: string; focused: boolean }) => {
    return (
        <Animated.View>
            <MaterialCommunityIcons
                name={name}
                size={focused ? 28 : 20}
                color={color}
                style={{
                    opacity: focused ? 1 : 0.7
                }}
            />

        </Animated.View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 10
                },
                tabBarStyle: {
                    borderColor: '#ffffff',
                    height: 64,
                    backgroundColor: '#ffffff',
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarShowLabel: true,
                tabBarItemStyle: {
                    padding: 6,
                },
            }}>
            <Tabs.Screen
                name="market"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="chart-line"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="portfolio"
                options={{
                    title: 'Portefeuille',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="wallet"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="depot-retrait"
                options={{
                    title: 'Dépôt/Retrait',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="bank"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="account"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
