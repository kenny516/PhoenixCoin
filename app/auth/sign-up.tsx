import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        // Implement sign up logic here
        console.log('Sign up:', name, email, password);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 p-6 justify-center">
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
                    <Text className="text-gray-600 mt-2">Sign up to get started</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2">Full Name</Text>
                        <TextInput
                            className="p-4 border border-gray-300 rounded-xl"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2">Email</Text>
                        <TextInput
                            className="p-4 border border-gray-300 rounded-xl"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2">Password</Text>
                        <TextInput
                            className="p-4 border border-gray-300 rounded-xl"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSignUp}
                        className="bg-blue-500 p-4 rounded-xl">
                        <Text className="text-white text-center font-semibold text-lg">
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <Link href="/auth/sign-in" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-500 font-semibold">Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
