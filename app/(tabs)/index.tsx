import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView className="flex-1">
                {/* Header avec logo */}
                <View className="flex-row justify-between items-center p-6">
                    <View className="flex-row items-center gap-2">

                        <Text className="text-2xl font-bold text-blue-600">Phoenix Coin</Text>
                    </View>
                </View>

                {/* Hero Section */}
                <View className="mx-4 mt-4">
                    <View className="bg-blue-600 p-6 rounded-3xl">
                        <Text className="text-white text-3xl font-bold mb-2">
                            Trade Crypto with Confidence
                        </Text>
                        <Text className="text-blue-100 text-lg mb-4">
                            Buy, sell, and manage your crypto portfolio in one place
                        </Text>
                        <View className="bg-white/10 p-4 rounded-xl">
                            <Text className="text-white">Total Market Cap</Text>
                            <Text className="text-white text-2xl font-bold mt-1">$2.14T</Text>
                            <View className="flex-row items-center mt-2">
                                <Text className="text-green-400">↑ 3.2%</Text>
                                <Text className="text-white/70 ml-2">24h Change</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Popular Coins */}
                <View className="mx-4 mt-6">
                    <Text className="text-xl font-bold mb-4">Popular Coins</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['Bitcoin', 'Ethereum', 'BNB'].map((coin, index) => (
                            <View key={index} className="bg-white p-4 rounded-2xl mr-4 shadow-sm w-40">
                                <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                                    <Text className="text-blue-600 font-bold">{coin[0]}</Text>
                                </View>
                                <Text className="font-medium">{coin}</Text>
                                <Text className="text-green-500 mt-1">+1.2%</Text>
                                <Text className="text-gray-600 font-bold mt-1">$42,384.21</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Features Section */}
                <View className="mx-4 mt-8">
                    <Text className="text-xl font-bold mb-4">Why Choose Phoenix Coin?</Text>
                    <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <Text className="font-bold text-lg mb-2">Secure Storage</Text>
                        <Text className="text-gray-600">Your crypto assets are protected by industry-leading security protocols</Text>
                    </View>
                    <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <Text className="font-bold text-lg mb-2">24/7 Trading</Text>
                        <Text className="text-gray-600">Trade anytime, anywhere with our reliable platform</Text>
                    </View>
                </View>

                {/* CTA Section */}
                <View className="mx-4 mt-6 mb-8">
                    <View className="bg-gray-100 p-6 rounded-2xl">
                        <Text className="text-xl font-bold mb-2">Start Trading Now</Text>
                        <Text className="text-gray-600 mb-4">Join millions of traders worldwide</Text>
                        <Link href="/auth/sign-up" asChild>
                            <TouchableOpacity className="bg-blue-600 p-4 rounded-xl">
                                <Text className="text-white text-center font-bold">Create Account</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href="/auth/sign-in" asChild>
                            <TouchableOpacity className="mt-3">
                                <Text className="text-blue-600 text-center font-semibold">Already have an account? Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

