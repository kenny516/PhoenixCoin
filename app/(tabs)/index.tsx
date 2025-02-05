import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Platform, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }} className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View>
                    {/* Header - sans le padding top supplémentaire */}
                    <View className="p-6 bg-primary-600">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="phoenix-framework" size={35} color="#ffffff" />
                                <Text className="ml-2 text-2xl font-bold text-white">Phoenix Coin</Text>
                            </View>
                            <TouchableOpacity
                                className="bg-primary-500 px-5 py-2.5 rounded-full border border-white elevation-3"
                                onPress={() => router.push('/(tabs)/content/market')}>
                                <Text className="font-bold text-white">Connexion</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Hero Section */}
                    <View className="px-4 pt-8">
                        <View className="items-center bg-white p-8 rounded-[24px] elevation-3 border-[1px] border-gray-200">
                            <Text className="text-4xl font-bold text-center text-primary-800" style={{ lineHeight: 40 }}>
                                Bienvenue sur Phoenix Coin
                            </Text>
                            <Text className="px-4 mt-4 text-base text-center text-gray-700">
                                La plateforme de cryptomonnaie la plus fiable
                            </Text>
                        </View>
                    </View>

                    {/* CTA Section */}
                    <View className="px-4 mt-8">
                        <TouchableOpacity
                            className="bg-primary-600 p-4 rounded-[20px] elevation-3"
                            onPress={() => router.push('/auth/sign-up')}>
                            <Text className="text-lg font-bold text-center text-white">Commencer Maintenant</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Features */}
                    <View className="px-4 mt-12">
                        <Text className="mb-6 text-2xl font-bold text-gray-800">Pourquoi Nous Choisir?</Text>
                        {features.map((feature, index) => (
                            <View key={index} className="bg-white p-6 rounded-[20px] mb-4 elevation-2 border-[1px] border-gray-200">
                                <View className="flex-row items-center">
                                    <View className="items-center justify-center w-12 h-12 rounded-full elevation-3 bg-primary-600">
                                        <Feather name={feature.icon} size={24} color="#ffffff" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="text-lg font-bold text-gray-800">{feature.title}</Text>
                                        <Text className="mt-1 text-gray-600">{feature.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>


                    {/* Footer */}
                    <View className="p-6 bg-gray-50 mt-8 rounded-t-[32px] border-t-[1px] border-gray-200">
                        <Text className="text-sm text-center text-gray-600">
                            En continuant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

