import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function HomeScreen() {
    const CryptoCard = ({ name, price }: { name: string; price: string }) => (
        <View className="card mr-4 w-40">
            <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Text className="text-blue-500 font-bold">{name[0]}</Text>
            </View>
            <Text className="font-medium">{name}</Text>
            <Text className="text-green-500 mt-1">+1.2%</Text>
            <Text className="text-gray-600 font-bold mt-1">{price}</Text>
        </View>
    );

    const FeatureCard = ({ title, description }: { title: string; description: string }) => (
        <View className="card mb-[var(--spacing-4)]">
            <Text className="font-bold text-lg mb-[var(--spacing-2)]">{title}</Text>
            <Text className="text-[var(--gray-600)]">{description}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center p-6">
                    <Text className="text-2xl font-bold text-blue-500">Phoenix Coin</Text>
                </View>

                {/* Hero Section */}
                <View className="mx-4">
                    <View className="bg-blue-500 p-6 rounded-3xl">
                        <Text className="title-text text-white mb-[var(--spacing-2)]">
                            Trade Crypto with Confidence
                        </Text>
                        <Text className="subtitle-text text-[var(--primary-light)]">
                            Buy, sell, and manage your crypto portfolio in one place
                        </Text>
                        <View className="bg-white/10 p-[var(--spacing-4)] rounded-xl mt-[var(--spacing-4)]">
                            <Text className="text-white">Total Market Cap</Text>
                            <Text className="text-white text-2xl font-bold mt-[var(--spacing-1)]">$2.14T</Text>
                            <View className="flex-row items-center mt-[var(--spacing-2)]">
                                <Text className="text-[var(--success)]">↑ 3.2%</Text>
                                <Text className="text-white/70 ml-[var(--spacing-2)]">24h Change</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Popular Coins */}
                <View className="mx-[var(--spacing-4)] mt-[var(--spacing-6)]">
                    <Text className="title-text mb-[var(--spacing-4)]">Popular Coins</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <CryptoCard name="Bitcoin" price="$42,384.21" />
                        <CryptoCard name="Ethereum" price="$2,284.21" />
                        <CryptoCard name="BNB" price="$312.21" />
                    </ScrollView>
                </View>

                {/* Features */}
                <View className="mx-[var(--spacing-4)] mt-[var(--spacing-8)]">
                    <Text className="title-text mb-[var(--spacing-4)]">Why Choose Phoenix Coin?</Text>
                    <FeatureCard
                        title="Secure Storage"
                        description="Your crypto assets are protected by industry-leading security protocols"
                    />
                    <FeatureCard
                        title="24/7 Trading"
                        description="Trade anytime, anywhere with our reliable platform"
                    />
                </View>

                {/* CTA Section */}
                <View className="mx-[var(--spacing-4)] my-[var(--spacing-8)]">
                    <View className="bg-[var(--gray-100)] p-[var(--spacing-6)] rounded-2xl">
                        <Text className="title-text mb-[var(--spacing-2)]">Start Trading Now</Text>
                        <Text className="subtitle-text mb-[var(--spacing-4)]">Join millions of traders worldwide</Text>
                        <Link href="/auth/sign-up" asChild>
                            <TouchableOpacity className="btn-primary">
                                <Text className="text-white text-center font-bold">Create Account</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href="/auth/sign-in" asChild>
                            <TouchableOpacity className="mt-[var(--spacing-3)]">
                                <Text className="text-[var(--primary-color)] text-center font-semibold">
                                    Already have an account? Sign In
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

