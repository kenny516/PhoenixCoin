import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, SafeAreaView, StatusBar, Alert, ScrollView, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState({
        pseudo: "JohnDoe",
        email: "john.doe@example.com",
        dateNaissance: "01/01/1990",
        telephone: "+261 34 00 000 00",
        adresse: "Antananarivo, Madagascar"
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions pour accéder à vos photos!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions pour accéder à votre caméra!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const InfoRow = ({ label, value, icon }: { label: string, value: string, icon?: string }) => (
        <View className="flex-row items-center justify-between py-3 border-b border-secondary-100">
            <View className="flex-row items-center gap-2 space-x-3">
                {icon && (
                    <View className="p-1.5 rounded-lg bg-primary-50">
                        <Feather name={icon} size={18} className="text-primary-500" />
                    </View>
                )}
                <Text className="text-sm text-text-muted">{label}</Text>
            </View>
            <Text className="text-sm font-semibold text-text-light">{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
            <ScrollView className="flex-1">
                {/* En-tête avec dégradé */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    className="px-4 pt-6 pb-20"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View className="flex-row items-center space-x-3">
                        <Text className="text-2xl font-bold text-background-light">Profil</Text>
                    </View>
                </LinearGradient>

                <View className="px-4 -mt-16">
                    {/* Photo de profil avec actions */}
                    <View className="p-6 mb-4 shadow-xl bg-background-light rounded-2xl">
                        <View className="items-center">
                            <View className="relative mb-6">
                                <View className="w-32 h-32 overflow-hidden rounded-full shadow-xl">
                                    {image ? (
                                        <Image
                                            source={{ uri: image }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <LinearGradient
                                            colors={['#F1F5F9', '#F8FAFC']}
                                            className="items-center justify-center w-full h-full"
                                        >
                                            <Feather name="user" size={60} className="text-secondary-300" />
                                        </LinearGradient>
                                    )}
                                </View>
                                <View className="absolute bottom-0 right-0">
                                    <TouchableOpacity
                                        onPress={() => {
                                            const handler = Platform.select({
                                                ios: () => {
                                                    Alert.alert(
                                                        "Changer la photo de profil",
                                                        "Choisissez une source",
                                                        [
                                                            { text: "Appareil photo", onPress: takePhoto },
                                                            { text: "Galerie", onPress: pickImage },
                                                            { text: "Annuler", style: "cancel" }
                                                        ]
                                                    );
                                                },
                                                android: () => takePhoto(),
                                                default: () => takePhoto()
                                            });
                                            handler?.();
                                        }}
                                        className="p-3 rounded-full shadow-lg bg-primary-500"
                                        style={{
                                            shadowColor: '#3B82F6',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 4,
                                            elevation: 6
                                        }}>
                                        <Feather name="camera" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={pickImage}
                                className="flex-row items-center justify-center w-full gap-2 p-6 px-6 py-4 space-x-3 bg-primary-500 rounded-xl"
                                style={{
                                    shadowColor: '#3B82F6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                    elevation: 4
                                }}>
                                <Feather name="image" size={20} color="#fff" />
                                <Text className="text-base font-bold text-white">
                                    Choisir depuis la galerie
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Informations personnelles */}
                    <View className="p-5 shadow-xl bg-background-light rounded-2xl">
                        <View className="flex-row items-center gap-2 mb-5 space-x-3">
                            <View className="p-2 rounded-xl bg-primary-50">
                                <Feather name="user" size={22} className="text-primary-500" />
                            </View>
                            <Text className="text-lg font-bold text-text-light">
                                Informations personnelles
                            </Text>
                        </View>

                        <View className="space-y-0.5 divide-y divide-secondary-100">
                            <InfoRow label="Pseudo" value={userInfo.pseudo} icon="at-sign" />
                            <InfoRow label="Email" value={userInfo.email} icon="mail" />
                            <InfoRow label="Date de naissance" value={userInfo.dateNaissance} icon="calendar" />
                            <InfoRow label="Téléphone" value={userInfo.telephone} icon="phone" />
                            <InfoRow label="Adresse" value={userInfo.adresse} icon="map-pin" />
                        </View>
                    </View>
                </View>

                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}