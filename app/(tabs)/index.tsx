import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Platform, Dimensions, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { PhoenixLogo } from '../../components/PhoenixLogo';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
    const features = [
        {
            icon: 'shield',
            title: 'Stockage Sécurisé',
            description: 'Vos actifs crypto sont protégés par des mesures de sécurité de pointe'
        },
        {
            icon: 'trending-up',
            title: 'Trading en Temps Réel',
            description: 'Exécutez des transactions instantanément avec des données de marché en temps réel'
        },
        {
            icon: 'clock',
            title: 'Accès 24/7',
            description: 'Échangez des cryptomonnaies à tout moment, partout dans le monde'
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-background" style={{
            paddingTop: Platform.OS === 'android' ? 25 : 0,
        }}>
            <StatusBar style="dark" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="pt-4">
                    {/* Header */}
                    <View className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-b-3xl shadow-lg">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="phoenix-framework" size={35} color="#ffffff" />
                                <Text className="text-2xl font-bold text-white ml-2">Phoenix Coin</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-white/20 px-4 py-2 rounded-full"
                                onPress={() => router.push('/auth/sign-in')}>
                                <Text className="text-white font-semibold">Connexion</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Hero Section */}
                    <View className="px-6 pt-8">
                        <View className="items-center bg-white p-6 rounded-3xl shadow-md">
                            <Text className="text-4xl font-bold text-center text-primary-900 mt-4">
                                Échangez des Cryptos en Toute Confiance
                            </Text>
                            <Text className="text-secondary-600 text-center mt-4 text-lg px-4">
                                La plateforme de cryptomonnaie la plus fiable
                            </Text>
                        </View>
                    </View>

                    {/* Statistics */}
                    <View className="flex-row justify-around px-4 mt-8">
                        {[
                            { value: '95M+', label: 'Utilisateurs vérifiés', icon: 'users' },
                            { value: '100+', label: 'Pays', icon: 'globe' },
                            { value: '1T+€', label: 'Volume d\'échange', icon: 'trending-up' }
                        ].map((stat, index) => (
                            <View key={index} className="items-center bg-white p-4 rounded-2xl shadow-sm flex-1 mx-2">
                                <Feather name={stat.icon} size={24} className="text-primary-500" />
                                <Text className="text-2xl font-bold text-primary-500 mt-2">{stat.value}</Text>
                                <Text className="text-secondary-500 text-sm mt-1 text-center">{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Features */}
                    <View className="px-6 mt-12">
                        <Text className="text-2xl font-bold text-primary-900 mb-8">Pourquoi Nous Choisir?</Text>
                        {features.map((feature, index) => (
                            <View key={index} className="bg-white p-6 rounded-2xl mb-4 shadow-sm">
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full items-center justify-center">
                                        <Feather name={feature.icon} size={24} color="#ffffff" />
                                    </View>
                                    <View className="ml-4 flex-1">
                                        <Text className="text-lg font-semibold text-primary-900">{feature.title}</Text>
                                        <Text className="text-secondary-600 mt-1">{feature.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* CTA Section */}
                    <View className="p-6 mt-8">
                        <TouchableOpacity
                            className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg"
                            onPress={() => router.push('/auth/sign-up')}>
                            <Text className="text-white text-center text-lg font-semibold">Commencer Maintenant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mt-4 bg-white p-4 rounded-2xl border border-primary-500"
                            onPress={() => router.push('/auth/sign-up')}>
                            <Text className="text-center text-primary-500 font-semibold">
                                Créer un Compte
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="p-6 bg-secondary-50 mt-8 rounded-t-3xl">
                        <Text className="text-center text-secondary-600">
                            En continuant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

