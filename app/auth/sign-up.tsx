import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, Platform, StatusBar } from 'react-native';
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
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                <View className="justify-center flex-1 px-6 py-12">
                    <View className="items-center mb-10">
                        <FontAwesome5 name="phoenix-framework" size={50} color="#3B82F6" />
                        <Text className="text-3xl font-bold text-text-light">Créer un compte</Text>
                        <Text className="mt-2 text-text-muted">Inscrivez-vous pour commencer</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="mb-2 font-medium text-text-light">Nom complet</Text>
                            <View className="flex-row items-center px-4 border border-secondary-300 rounded-xl">
                                <Feather name="user" size={20} color="text-muted" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre nom complet"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            {errors.name ? <Text className="mt-1 text-error">{errors.name}</Text> : null}
                        </View>

                        <View>
                            <Text className="mb-2 font-medium text-text-light">Email</Text>
                            <View className="flex-row items-center px-4 border border-gray-300 rounded-xl">
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
                            {errors.email ? <Text className="mt-1 text-red-500">{errors.email}</Text> : null}
                        </View>

                        <View>
                            <Text className="mb-2 font-medium text-gray-700">Mot de passe</Text>
                            <View className="flex-row items-center px-4 border border-gray-300 rounded-xl">
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
                            {errors.password ? <Text className="mt-1 text-red-500">{errors.password}</Text> : null}
                        </View>

                        <TouchableOpacity
                            onPress={handleSignUp}
                            className="p-4 mt-4 bg-primary-500 rounded-xl">
                            <Text className="text-lg font-semibold text-center text-white">
                                S'inscrire
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-600">Vous avez déjà un compte? </Text>
                            <Link href="/auth/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text className="font-semibold text-primary-500">Se connecter</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
