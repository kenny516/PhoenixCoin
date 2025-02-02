import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Platform, Animated, Pressable } from 'react-native';
import { useMemo } from 'react';

const TabBarIcon = ({ name, color, focused }: { name: any; color: string; focused: boolean }) => {
    const scale = useMemo(() => new Animated.Value(1), []);
    const translateY = useMemo(() => new Animated.Value(0), []);

    useMemo(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: focused ? 1.2 : 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }),
            Animated.spring(translateY, {
                toValue: focused ? -8 : 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            })
        ]).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{ scale }, { translateY }],
                backgroundColor: focused ? '#f0f7ff' : 'transparent',
                borderRadius: 20,
                padding: 12,
                minWidth: 56,
                minHeight: 56,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? '#2563eb' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: focused ? 8 : 0,
            }}
        >
            <MaterialCommunityIcons
                name={name}
                size={focused ? 30 : 26}
                color={color}
                style={{
                    opacity: focused ? 1 : 0.8
                }}
            />
            {focused && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 6,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#2563eb',
                        shadowColor: '#2563eb',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                    }}
                />
            )}
        </Animated.View>
    );
};

const TabBarLabel = ({ label, focused }: { label: string; focused: boolean }) => (
    focused ? null : (
        <Text
            style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#94a3b8',
                marginTop: 4,
                opacity: 0.8
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
                    height: 75,
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 28 : 20,
                    left: 20,
                    right: 20,
                    borderRadius: 25,
                    paddingHorizontal: 8,
                    paddingVertical: 12,
                    elevation: 25,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(229, 231, 235, 0.3)',
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarShowLabel: true,
                tabBarItemStyle: {
                    padding: 4,
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
        </Tabs>
    );
}
