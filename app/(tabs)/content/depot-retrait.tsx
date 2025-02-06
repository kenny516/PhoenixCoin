import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
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

    return (
        <SafeAreaView className="flex-1 h-full bg-gray-50">
            <LinearGradient colors={['#2563EB', '#3B82F6']} className="p-4">
                <Text className="text-2xl font-bold text-white">
                    Transaction
                </Text>
            </LinearGradient>

            <View className="flex-1 w-full h-full p-4">
                <View className="flex-col p-4 gap-7 h-3/5 rounded-xl">
                    {/* Sélection du type d'action */}
                    <View>
                        <Text className="mb-1 text-sm font-medium text-gray-700">Type d'Action</Text>
                        <View className="overflow-hidden border border-gray-200 rounded-lg">
                            <Picker
                                selectedValue={type}
                                onValueChange={(itemValue) => setType(itemValue)}
                                style={{ backgroundColor: 'white' }}
                            >
                                <Picker.Item label="Sélectionner un type" value="" />
                                {typeActions.map((action) => (
                                    <Picker.Item key={action.id} label={action.designation} value={action.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Saisie du montant */}
                    <View>
                        <Text className="mb-1 text-sm font-medium text-gray-700">Montant (€)</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="0.00"
                            className="p-3 bg-white border border-gray-200 rounded-lg"
                        />
                    </View>

                    {/* Saisie du numéro de carte */}
                    <View>
                        <Text className="mb-1 text-sm font-medium text-gray-700">Numéro de carte</Text>
                        <TextInput
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            keyboardType="numeric"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="p-3 bg-white border border-gray-200 rounded-lg"
                        />
                    </View>

                    {/* Bouton de confirmation */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className={`p-4 rounded-xl ${type === 'depot' ? 'bg-accent-500' : 'bg-primary-500'}`}
                    >
                        <Text className="text-lg font-bold text-center text-white">
                            {type === 'depot' ? 'Confirmer le dépôt' : 'Confirmer le retrait'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
