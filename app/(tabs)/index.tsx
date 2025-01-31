import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

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
        <SafeAreaView className="flex-1 bg-white" style={{
            paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}>
                <View className="pt-4">
                    {/* Header */}
                    <View className="p-6">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-2xl font-bold text-primary-500">Phoenix Coin</Text>
                            <Link href="/auth/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary-500 font-semibold">Connexion</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    {/* Hero Section */}
                    <View className="px-6 pt-8">
                        <View className="items-center">
                            <Text className="text-4xl font-bold text-center text-text-light mt-8">
                                Échangez des Cryptos en Toute Confiance
                            </Text>
                            <Text className="text-text-muted text-center mt-4 text-lg">
                                La plateforme de cryptomonnaie la plus fiable
                            </Text>
                        </View>
                    </View>

                    {/* Statistics */}
                    <View className="flex-row justify-around px-6 mt-12">
                        {[
                            { value: '95M+', label: 'Utilisateurs vérifiés' },
                            { value: '100+', label: 'Pays' },
                            { value: '1T+€', label: 'Volume d\'échange' }
                        ].map((stat, index) => (
                            <View key={index} className="items-center">
                                <Text className="text-2xl font-bold text-primary-500">{stat.value}</Text>
                                <Text className="text-text-muted text-sm mt-1">{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Features */}
                    <View className="px-6 mt-12">
                        <Text className="text-2xl font-bold text-text-light mb-8">Pourquoi Nous Choisir?</Text>
                        {features.map((feature, index) => (
                            <View key={index} className="flex-row items-start mb-8">
                                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                                    <Feather name={feature.icon} size={24} color="#6366F1" />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="text-lg font-semibold text-text-light">{feature.title}</Text>
                                    <Text className="text-text-muted mt-1">{feature.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* CTA Section */}
                    <View className="p-6 mt-8">
                        <TouchableOpacity
                            className="bg-primary-500 p-4 rounded-2xl"
                            onPress={() => {
                                // Navigation logic
                            }}>
                            <Text className="text-white text-center text-lg font-semibold">Commencer</Text>
                        </TouchableOpacity>
                        <Link href="/auth/sign-up" asChild>
                            <TouchableOpacity className="mt-4">
                                <Text className="text-center text-primary-500 font-semibold">
                                    Créer un Compte
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Footer */}
                    <View className="p-6 bg-secondary-50 mt-8">
                        <Text className="text-center text-text-muted">
                            En continuant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

