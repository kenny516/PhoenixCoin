import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = () => {
        // Implement sign in logic here
        console.log('Sign in:', email, password);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{
            paddingTop: Platform.OS === 'android' ? 25 : 0
        }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                <View className="flex-1 px-6 py-12 justify-center">
                    <View className="items-center mb-10">
                        <FontAwesome5 name="phoenix-framework" size={50} color="#3B82F6" />
                        <Text className="text-3xl font-bold text-text-light">Bienvenue</Text>
                        <Text className="text-text-muted mt-2">Connectez-vous pour continuer</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-text-light mb-2 font-medium">Email</Text>
                            <View className="flex-row items-center border border-secondary-300 rounded-xl px-4">
                                <Feather name="mail" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 p-4 text-text-light"
                                    placeholder="Entrez votre email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-text-light mb-2 font-medium">Mot de passe</Text>
                            <View className="flex-row items-center border border-secondary-300 rounded-xl px-4">
                                <Feather name="lock" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre mot de passe"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity className="items-end">
                            <Text className="text-primary-500">Mot de passe oublié?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSignIn}
                            className="bg-primary-500 p-4 rounded-xl mt-4">
                            <Text className="text-white text-center font-semibold text-lg">
                                Se connecter
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-600">Vous n'avez pas de compte? </Text>
                            <Link href="/auth/sign-up" asChild>
                                <TouchableOpacity>
                                    <Text className="text-blue-500 font-semibold">S'inscrire</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
