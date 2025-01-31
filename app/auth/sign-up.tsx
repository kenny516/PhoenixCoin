import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };

        if (name.length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères';
            isValid = false;
        }

        if (!email.includes('@')) {
            newErrors.email = 'Email invalide';
            isValid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignUp = () => {
        if (validateForm()) {
            // Implement sign up logic here
            console.log('Sign up:', name, email, password);
        }
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
                        <Text className="text-3xl font-bold text-text-light">Créer un compte</Text>
                        <Text className="text-text-muted mt-2">Inscrivez-vous pour commencer</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-text-light mb-2 font-medium">Nom complet</Text>
                            <View className="flex-row items-center border border-secondary-300 rounded-xl px-4">
                                <Feather name="user" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre nom complet"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            {errors.name ? <Text className="text-red-500 mt-1">{errors.name}</Text> : null}
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                                <Feather name="mail" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.email ? <Text className="text-red-500 mt-1">{errors.email}</Text> : null}
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2 font-medium">Mot de passe</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                                <Feather name="lock" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Créez un mot de passe"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? <Text className="text-red-500 mt-1">{errors.password}</Text> : null}
                        </View>

                        <TouchableOpacity
                            onPress={handleSignUp}
                            className="bg-primary-500 p-4 rounded-xl mt-4">
                            <Text className="text-white text-center font-semibold text-lg">
                                S'inscrire
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-600">Vous avez déjà un compte? </Text>
                            <Link href="/auth/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text className="text-blue-500 font-semibold">Se connecter</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
