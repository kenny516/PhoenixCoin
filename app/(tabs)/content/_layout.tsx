import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Platform, Animated } from 'react-native';
import { useMemo } from 'react';

const TabBarIcon = ({ name, color, focused }: { name: any; color: string; focused: boolean }) => {
    return (
        <Animated.View style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
        }}>
            <MaterialCommunityIcons
                name={name}
                size={22}
                color={color}
                style={{
                    opacity: focused ? 1 : 0.7,
                    transform: [{ scale: focused ? 1.1 : 1 }],
                }}
            />
        </Animated.View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                animation: 'shift',
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                    marginBottom: 4,
                },
                tabBarStyle: {
                    height: 56,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    paddingHorizontal: 10,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#64748B',
                tabBarShowLabel: true,
                tabBarItemStyle: {
                    padding: 4,
                },
            }}>
            <Tabs.Screen
                name="market"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="chart-line"
                            color={focused ? '#2563eb' : '#64748B'}
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
                            color={focused ? '#2563eb' : '#64748B'}
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
                            color={focused ? '#2563eb' : '#64748B'}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'profile',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            name="account-outline"
                            color={focused ? '#2563eb' : '#64748B'}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
