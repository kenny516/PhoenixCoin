import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type TransactionType = 'depot' | 'retrait';

export default function DepotRetraitScreen() {
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [type, setType] = useState<TransactionType>('depot');

    const handleSubmit = () => {
        if (!amount || !cardNumber) {
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
                        // process depot ou retrait
                        console.log("type = ", type);
                        console.log("amount = ", amount);
                        console.log("cardNumber = ", cardNumber);
                        Alert.alert('Succès', `${type === 'depot' ? 'Dépôt' : 'Retrait'} effectué avec succès`);
                        setAmount('');
                        setCardNumber('');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                className="p-4"
            >
                <Text className="text-2xl font-bold text-white">
                    {type === 'depot' ? 'Dépôt' : 'Retrait'}
                </Text>
            </LinearGradient>

            <ScrollView className="flex-1 p-4">
                <View className="flex-row justify-around mb-6">
                    <TouchableOpacity
                        onPress={() => setType('depot')}
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-xl mx-2 shadow-sm
                            ${type === 'depot'
                                ? 'bg-accent-500'
                                : 'bg-gray-50 border border-accent-100'}`}
                    >
                        <MaterialCommunityIcons
                            name="bank-transfer-in"
                            size={24}
                            color={type === 'depot' ? 'white' : '#10B981'}
                        />
                        <Text className={`ml-3 font-bold ${type === 'depot' ? 'text-white' : 'text-accent-500'}`}>
                            Dépôt
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setType('retrait')}
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-xl mx-2 shadow-sm
                            ${type === 'retrait'
                                ? 'bg-primary-500'
                                : 'bg-gray-50 border border-primary-100'}`}
                    >
                        <MaterialCommunityIcons
                            name="bank-transfer-out"
                            size={24}
                            color={type === 'retrait' ? 'white' : '#3B82F6'}
                        />
                        <Text className={`ml-3 font-bold ${type === 'retrait' ? 'text-white' : 'text-primary-500'}`}>
                            Retrait
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="p-4 space-y-6 bg-white shadow-md rounded-xl">
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

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className={`p-4 rounded-xl ${type === 'depot' ? 'bg-accent-500' : 'bg-primary-500'}`}
                    >
                        <Text className="text-lg font-bold text-center text-white">
                            {type === 'depot' ? 'Confirmer le dépôt' : 'Confirmer le retrait'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
