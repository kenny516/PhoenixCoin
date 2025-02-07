import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import Toast from 'react-native-toast-message';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FirebaseError } from 'firebase/app';

export default function SignUpScreen() {
    const [loading, setLoading] = useState(false);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateNaissance, setDateNaissance] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState({
        nom: '',
        prenom: '',
        date_naissance: '',
        email: '',
        password: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nom: '',
            prenom: '',
            date_naissance: '',
            email: '',
            password: ''
        };

        if (nom.length < 2) {
            newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
            isValid = false;
        }

        if (prenom.length < 2) {
            newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
            isValid = false;
        }

        if (!dateNaissance) {
            newErrors.date_naissance = 'La date de naissance est requise';
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

    const onChangeDatePicker = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            setDateNaissance(format(selectedDate, 'dd/MM/yyyy', { locale: fr }));
        }
    };

    const getFirebaseErrorMessage = (error: FirebaseError) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Cette adresse email est déjà utilisée';
            case 'auth/invalid-email':
                return 'Adresse email invalide';
            case 'auth/operation-not-allowed':
                return 'Opération non autorisée';
            case 'auth/weak-password':
                return 'Le mot de passe est trop faible';
            case 'auth/network-request-failed':
                return 'Problème de connexion internet';
            default:
                return 'Une erreur est survenue. Veuillez réessayer.';
        }
    };

    const handleSignUp = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                const user = await createUserWithEmailAndPassword(auth, email, password);

                try {
                    const [day, month, year] = dateNaissance.split('/');
                    const formattedDate = new Date(Number(year), Number(month) - 1, Number(day));

                    await setDoc(doc(db, 'profil', user.user.uid), {
                        nom,
                        prenom,
                        date_naissance: formattedDate.toISOString(),
                    });

                    Toast.show({
                        type: 'success',
                        text1: 'Compte créé avec succès',
                        text2: 'Bienvenue sur notre plateforme',
                        position: 'bottom',
                        visibilityTime: 4000,
                    });

                    router.replace('/auth/sign-in');
                } catch (firestoreError) {
                    // Si erreur Firestore, supprimer le compte créé
                    await user.user.delete();
                    Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: 'Erreur lors de la création du profil',
                        position: 'bottom',
                    });
                }
            } catch (error) {
                const firebaseError = error as FirebaseError;
                Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: getFirebaseErrorMessage(firebaseError),
                    position: 'bottom',
                });
            } finally {
                setLoading(false);
            }
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
                            <Text className="mb-2 font-medium text-text-light">Nom</Text>
                            <View className="flex-row items-center px-4 border border-secondary-300 rounded-xl">
                                <Feather name="user" size={20} color="text-muted" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre nom"
                                    value={nom}
                                    onChangeText={setNom}
                                />
                            </View>
                            {errors.nom ? <Text className="mt-1 text-error">{errors.nom}</Text> : null}
                        </View>

                        <View>
                            <Text className="mb-2 font-medium text-text-light">Prénom</Text>
                            <View className="flex-row items-center px-4 border border-secondary-300 rounded-xl">
                                <Feather name="user" size={20} color="text-muted" />
                                <TextInput
                                    className="flex-1 p-4"
                                    placeholder="Entrez votre prénom"
                                    value={prenom}
                                    onChangeText={setPrenom}
                                />
                            </View>
                            {errors.prenom ? <Text className="mt-1 text-error">{errors.prenom}</Text> : null}
                        </View>

                        <View>
                            <Text className="mb-2 font-medium text-text-light">Date de naissance</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="flex-row items-center px-4 border border-secondary-300 rounded-xl h-[56px]"
                            >
                                <Feather name="calendar" size={20} color="#6B7280" />
                                <Text className="flex-1 p-4 text-gray-600">
                                    {dateNaissance || "Sélectionner votre date de naissance"}
                                </Text>
                            </TouchableOpacity>
                            {Platform.OS === 'android' ? (
                                showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChangeDatePicker}
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1920, 0, 1)}
                                    />
                                )
                            ) : (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={onChangeDatePicker}
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1920, 0, 1)}
                                    style={{ display: showDatePicker ? 'flex' : 'none' }}
                                />
                            )}
                            {errors.date_naissance ? (
                                <Text className="mt-1 text-red-500">{errors.date_naissance}</Text>
                            ) : null}
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
                                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? <Text className="mt-1 text-red-500">{errors.password}</Text> : null}
                        </View>

                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={loading}
                            className="p-4 mt-4 bg-primary-500 rounded-xl">
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-lg font-semibold text-center text-white">
                                    S'inscrire
                                </Text>
                            )}
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
