import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, SafeAreaView, StatusBar, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { ImageKitService } from '@/service/imageKitService';
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);  // nouvel état pour le chargement
    const [userInfo, setUserInfo] = useState({
        nom: "",
        prenom: "",
        email: "",
        pdp: "",
        date_naissance: "",
    });

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "profil", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserInfo({
                        nom: data.nom || '',
                        prenom: data.prenom || '',
                        email: user.email || '',
                        pdp: data.pdp || '',
                        date_naissance: data.date_naissance || '',
                    });
                    setImage(data.pdp);
                }
            }
        } catch (error) {
            console.log('Error getting user profile:', error);
            Alert.alert('Erreur', 'Impossible de charger le profil');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (imageUri: string) => {
        setUpdating(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user');
            const imageService = new ImageKitService();
            console.log('Uploading image...');
            const imageUrl = await imageService.uploadImage(imageUri, userInfo.email);
            const userRef = doc(db, "profil", user.uid);

            await updateDoc(userRef, {
                pdp: imageUrl.url,
                updatedAt: new Date()
            });
            setImage(imageUrl.url);
            Toast.show({
                type: "success",
                text1: "Succès",
                text2: "photo de profiele modifier ✅",
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erreur de connection",
                text2: "Veuillez verifier votre connection internet 🛜",
            });
        } finally {
            setUpdating(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await updateProfile(result.assets[0].uri);
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
            await updateProfile(result.assets[0].uri);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/auth/sign-in');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de se déconnecter');
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
                <View
                    className="px-4 pt-6 pb-20 bg-primary-600"
                >
                    <View className="flex-row items-center space-x-3">
                        <Text className="text-2xl font-bold text-background-light">Profil</Text>
                    </View>
                </View>

                <View className="px-4 -mt-16">
                    {/* Photo de profil avec actions */}
                    <View className="p-6 mb-4 shadow-xl bg-background-light rounded-2xl">
                        <View className="items-center">
                            <View className="relative mb-6">
                                <View className="w-32 h-32 overflow-hidden rounded-full shadow-xl">
                                    {updating ? (
                                        <View className="items-center justify-center w-full h-full bg-gray-100">
                                            <ActivityIndicator size="large" color="#3B82F6" />
                                        </View>
                                    ) : image ? (
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
                                disabled={updating}
                                className={`flex-row items-center justify-center w-full gap-2 p-6 px-6 py-4 space-x-3 rounded-xl ${updating ? 'bg-gray-400' : 'bg-primary-500'}`}
                                style={{
                                    shadowColor: '#3B82F6',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                    elevation: 4
                                }}>
                                {updating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Feather name="image" size={20} color="#fff" />
                                        <Text className="text-base font-bold text-white">
                                            Choisir depuis la galerie
                                        </Text>
                                    </>
                                )}
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
                            <InfoRow label="nom" value={userInfo.nom} icon="at-sign" />
                            <InfoRow label="prenom" value={userInfo.prenom} icon="at-sign" />
                            <InfoRow label="Email" value={userInfo.email} icon="mail" />
                            <InfoRow label="Date de naissance" value={userInfo.date_naissance} icon="calendar" />
                        </View>
                        {/* Bouton de déconnexion */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center justify-center w-1/2 gap-2 p-4 mx-auto mt-4 space-x-2 bg-red-500 rounded-xl"
                            style={{
                                shadowColor: '#EF4444',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                elevation: 4
                            }}
                        >
                            <Feather name="log-out" size={20} color="#fff" />
                            <Text className="text-base font-bold text-white">
                                Se déconnecter
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="h-6" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}