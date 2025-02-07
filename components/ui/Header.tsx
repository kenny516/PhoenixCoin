import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

type HeaderProps = {
    title: string;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
};

export default function Header({ title, showBackButton = false, rightComponent }: HeaderProps) {
    return (
        <>
            <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute left-0 right-0 w-full h-24"
            />
            <BlurView intensity={20} className="absolute left-0 right-0 w-full h-24" />

            <View
                style={{
                    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                }}
                className="relative px-4 pb-4 pt-safe"
            >
                <View className="flex-row items-center justify-between h-16">
                    <View className="flex-row items-center">
                        {showBackButton && (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="mr-3 rounded-full"
                            >
                                <Feather name="arrow-left" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                        <Text className="text-xl font-bold text-white">{title}</Text>
                    </View>

                    {rightComponent && (
                        <View className="flex-row items-center">
                            {rightComponent}
                        </View>
                    )}
                </View>
            </View>
        </>
    );
}
