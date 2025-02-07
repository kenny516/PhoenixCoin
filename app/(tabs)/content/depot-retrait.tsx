import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { TypeAction } from '@/utils/type';

export default function DepotRetraitScreen() {
    const [amount, setAmount] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [typeActions, setTypeActions] = useState<TypeAction[]>([]);
    const [type, setType] = useState<string>('');

    useEffect(() => {
        loadTypeAction();
    }, []);

    const loadTypeAction = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = collection(db, 'type_action');
                const q = query(docRef);
                const querySnapshot = await getDocs(q);

                const typeActionListe: TypeAction[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    designation: doc.data().designation,
                }));

                setTypeActions(typeActionListe);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur de connexion',
                text2: 'Veuillez vérifier votre connexion internet 🛜',
            });
            console.error('Error loading type actions:', error);
        }
    };

    const handleSubmit = () => {
        if (!amount || !cardNumber || !type) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (!/^\d+$/.test(amount)) {
            Alert.alert('Erreur', 'Le montant doit être un nombre valide');
            return;
        }

        Alert.alert(
            'Confirmation',
            `Confirmer le ${type === 'depot' ? 'dépôt' : 'retrait'} de ${amount}€ ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Confirmer',
                    onPress: () => {
                        console.log('Type =', type);
                        console.log('Amount =', amount);
                        console.log('CardNumber =', cardNumber);
                        Alert.alert(
                            'Succès',
                            `${type === 'depot' ? 'Dépôt' : 'Retrait'} effectué avec succès`
                        );
                        setAmount('');
                        setCardNumber('');
                        setType('');
                    },
                },
            ]
        );
    };

    const renderPickerItem = (action: TypeAction) => {
        const isSelected = type === action.id;
        return (
            <TouchableOpacity
                key={action.id}
                onPress={() => setType(action.id)}
                className={`flex-row items-center p-4 mb-2 border rounded-xl ${isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-gray-50'
                    }`}
            >
                <Ionicons
                    name={action.designation.toLowerCase().includes('dépot') ? 'arrow-down-circle' : 'arrow-up-circle'}
                    size={24}
                    color={isSelected ? '#4F46E5' : '#6B7280'}
                />
                <Text className={`ml-3 text-base ${isSelected ? 'text-primary-600 font-semibold' : 'text-gray-700'
                    }`}>
                    {action.designation}
                </Text>
                {isSelected && (
                    <View className="ml-auto">
                        <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {/* Header */}
            <View
                className="w-full p-4 pt-4 bg-primary-600"
            >
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-white">
                        Transactions
                    </Text>
                    <Ionicons name="wallet-outline" size={24} color="white" />
                </View>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Card principale */}
                <View className="mt-4 overflow-hidden bg-white shadow-sm rounded-3xl">
                    <View className="p-5">
                        {/* Type d'action amélioré */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="swap-vertical" size={24} color="#4F46E5" />
                                <Text className="ml-2 text-xl font-semibold text-gray-900">
                                    Type de transaction
                                </Text>
                            </View>

                            <View className="space-y-2">
                                {Platform.OS === 'ios' ? (
                                    <View className="overflow-hidden border border-gray-200 rounded-xl bg-gray-50">
                                        <Picker
                                            selectedValue={type}
                                            onValueChange={setType}
                                            itemStyle={{ height: 120, fontSize: 16 }}
                                        >
                                            <Picker.Item
                                                label="Sélectionner un type"
                                                value=""
                                                color="#6B7280"
                                            />
                                            {typeActions.map((action) => (
                                                <Picker.Item
                                                    key={action.id}
                                                    label={action.designation}
                                                    value={action.id}
                                                    color="#111827"
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                ) : (
                                    <View className="space-y-2">
                                        {typeActions.map(renderPickerItem)}
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Montant */}
                        <View className="mb-6">
                            <Text className="mb-2 text-base font-semibold text-gray-700">
                                Montant (€)
                            </Text>
                            <View className="flex-row items-center px-4 border border-gray-200 rounded-xl bg-gray-50">
                                <Ionicons name="cash-outline" size={20} color="#6B7280" />
                                <TextInput
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                    className="flex-1 p-3 ml-2 text-gray-700"
                                />
                            </View>
                        </View>

                        {/* Numéro de carte */}
                        <View className="mb-6">
                            <Text className="mb-2 text-base font-semibold text-gray-700">
                                Numéro de carte
                            </Text>
                            <View className="flex-row items-center px-4 border border-gray-200 rounded-xl bg-gray-50">
                                <Ionicons name="card-outline" size={20} color="#6B7280" />
                                <TextInput
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    keyboardType="numeric"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="flex-1 p-3 ml-2 text-gray-700"
                                />
                            </View>
                        </View>

                        {/* Bouton de confirmation */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className='py-4 rounded-xl bg-primary-600'

                        >
                            <View className="flex-row items-center justify-center space-x-2">
                                <MaterialCommunityIcons
                                    name="bank-transfer"
                                    size={30}
                                    color="white"
                                />
                                <Text className="text-base font-semibold text-white">
                                    Confirmer la transaction
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
