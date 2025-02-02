import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Platform, Animated, Pressable } from 'react-native';
import { useMemo } from 'react';

const TabBarIcon = ({ name, color, focused }: { name: any; color: string; focused: boolean }) => {
    const scale = useMemo(() => new Animated.Value(1), []);

    useMemo(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.1 : 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7
        }).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{ scale }],
                backgroundColor: focused ? '#f0f7ff' : 'transparent',
                borderRadius: 14,
                padding: 6,
                minWidth: 36,
                minHeight: 36,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <MaterialCommunityIcons
                name={name}
                size={focused ? 22 : 20}
                color={color}
                style={{
                    opacity: focused ? 1 : 0.7
                }}
            />
        </Animated.View>
    );
};

const TabBarLabel = ({ label, focused }: { label: string; focused: boolean }) => (
    focused ? null : (
        <Text
            style={{
                fontSize: 10,
                fontWeight: '500',
                color: '#94a3b8',
                marginTop: 2,
                opacity: 0.7
            }}
        >
            {label}
        </Text>
    )
);

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    backgroundColor: '#ffffff',
                    paddingHorizontal: 6,
                    paddingVertical: 8,
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarShowLabel: true,
                tabBarItemStyle: {
                    padding: 2,
                },
            }}>
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Marché',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="chart-line"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <TabBarLabel label="Marché" focused={focused} />
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
                    tabBarLabel: ({ focused }) => (
                        <TabBarLabel label="Portefeuille" focused={focused} />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explorer',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="compass"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <TabBarLabel label="Explorer" focused={focused} />
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
                    tabBarLabel: ({ focused }) => (
                        <TabBarLabel label="Profil" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="depot-retrait"
                options={{
                    title: 'Dépôt/Retrait',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="bank-transfer"
                            color={focused ? '#2563eb' : '#94a3b8'}
                            focused={focused}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <TabBarLabel label="Dépôt/Retrait" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
