import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import {
    Profil,
    Transaction,
} from '@/utils/type';
import Toast from 'react-native-toast-message';

// Type utilisé pour chaque élément du portefeuille calculé
type PortfolioItem = {
    cryptoId: string;
    symbol: string;
    quantite: number;
};

// Fonctions de formatage
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
    }).format(value);
};

const formatCryptoAmount = (amount: number) => {
    return amount < 0.01 ? amount.toFixed(8) : amount.toFixed(4);
};

// Données de test pour les transactions (le portefeuille sera déduit de ces transactions)
const staticTransactions: Transaction[] = [
    {
        id: 't1',
        date_action: '2025-01-01T10:00:00.000Z',
        cours: 50000, // prix au moment de la transaction
        quantite: 0.1,
        profil: {
            id: 'p1',
            email: 'test@example.com',
            fondActuel: 5000,
        },
        crypto: {
            id: 'c1',
            designation: 'BTC',
        },
        transaction: {
            id: '1',
            designation: 'achat',
        },
    },
    {
        id: 't2',
        date_action: '2025-01-02T12:00:00.000Z',
        cours: 55000,
        quantite: 0.05,
        profil: {
            id: 'p1',
            email: 'test@example.com',
            fondActuel: 5000,
        },
        crypto: {
            id: 'c1',
            designation: 'BTC',
        },
        transaction: {
            id: '2',
            designation: 'vente',
        },
    },
    {
        id: 't3',
        date_action: '2025-01-03T15:00:00.000Z',
        cours: 1800,
        quantite: 2,
        profil: {
            id: 'p1',
            email: 'test@example.com',
            fondActuel: 5000,
        },
        crypto: {
            id: 'c2',
            designation: 'ETH',
        },
        transaction: {
            id: '1',
            designation: 'achat',
        },
    },
];

const statProfil: Profil = {
    email: "cksmmowmc",
    fondActuel: 2000,
    id: "c,socmwomow"
}

export default function PortfolioScreen() {
    const [profil, setProfil] = useState<Profil>(statProfil);
    const [transactions, setTransactions] = useState<Transaction[]>(staticTransactions);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadPortfolioData();
    }, []);

    // Chargement des données (ici, utilisation des données statiques)
    const loadPortfolioData = async () => {
        try {
            // Pour Firestore, vous pouvez décommenter et adapter ce bloc :

            const user = auth.currentUser;
            if (user) {
                const transactionsRef = collection(db, "historique_transaction_crypto");
                const q = query(transactionsRef, where("profil.id", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const transactionsList: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    transactionsList.push({
                        id: doc.id,
                        date_action: data.date_action.toDate().toISOString(),
                        cours: data.cours,
                        quantite: data.quantite,
                        profil: data.profil,
                        crypto: data.crypto,
                        transaction: {
                            id: data.id,
                            designation: data.designation
                        },
                    });
                });
                setTransactions(transactionsList);
                calculatePortfolio(transactionsList);
            }
        } catch (error) {
            Toast({})
            console.error('Error loading portfolio:', error);
        }
    };

    // Calculer le portefeuille à partir des transactions en regroupant par crypto
    const calculatePortfolio = (transactions: Transaction[]) => {
        const portfolioMap = new Map<string, PortfolioItem>();

        transactions.forEach((transaction) => {
            const cryptoId = transaction.crypto.id;
            const type = transaction.transaction.designation.toLowerCase(); // 'achat' ou 'vente'
            const quantite = transaction.quantite;
            const cours = transaction.cours;

            let item = portfolioMap.get(cryptoId);
            if (!item) {
                item = {
                    cryptoId,
                    symbol: transaction.crypto.designation,
                    quantite: 0
                };
            }

            if (type === 'achat') {
                item.quantite += quantite;

            } else if (type === 'vente') {
                item.quantite -= quantite;
            }


            portfolioMap.set(cryptoId, item);
        });

        setPortfolio(Array.from(portfolioMap.values()));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPortfolioData();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* En-tête avec gradient et balance */}
            <View
                className="px-6 pt-8 pb-12 rounded-b-[32px] shadow-lg bg-primary-600"
            >
                <Text className="mb-2 text-base font-medium text-indigo-200">Mon Portefeuille</Text>
                <View className="mb-6">
                    <Text className="text-5xl font-bold text-white">
                        {formatCurrency(profil.fondActuel)}
                    </Text>
                </View>

                {/* Mini résumé du portfolio */}
                <View className="flex-row justify-around">
                    <View className="items-center w-2/5 px-4 py-3 bg-white/10 rounded-2xl">
                        <Text className="text-xs text-indigo-200">Cryptos</Text>
                        <Text className="text-xl font-bold text-white">{portfolio.length}</Text>
                    </View>
                    <View className="items-center w-2/5 px-4 py-3 bg-white/10 rounded-2xl">
                        <Text className="text-xs text-indigo-200">Transactions</Text>
                        <Text className="text-xl font-bold text-white">{transactions.length}</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Section des actifs */}
                <View className="mt-6">
                    <Text className="mb-4 text-xl font-semibold text-gray-800">Mes actifs</Text>
                    <View className="p-4 bg-white shadow-sm rounded-3xl">
                        {portfolio.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`flex-row items-center justify-between py-4 ${index !== portfolio.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-center flex-1">
                                    <View className="items-center justify-center w-12 h-12 mr-4 bg-indigo-100 rounded-full">
                                        <Text className="text-lg font-bold text-indigo-600">{item.symbol[0]}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-lg font-semibold text-gray-800">{item.symbol}</Text>
                                        <Text className="text-sm text-gray-500">Quantité détenue</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-lg font-semibold text-gray-800">
                                        {formatCryptoAmount(item.quantite)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Section des transactions */}
                <View className="my-6">
                    <Text className="mb-4 text-xl font-semibold text-gray-800">Transactions récentes</Text>
                    <View className="overflow-hidden bg-white shadow-sm rounded-3xl">
                        {transactions.map((item, index) => {
                            const type = item.transaction.designation.toLowerCase() === 'achat';
                            return (
                                <View
                                    key={index}
                                    className={`p-4 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${type ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <MaterialIcons
                                                    name={type ? 'call-received' : 'call-made'}
                                                    size={24}
                                                    color={type ? '#059669' : '#DC2626'}
                                                />
                                            </View>
                                            <View>
                                                <Text className="text-lg font-semibold text-gray-800">
                                                    {type ? 'Achat' : 'Vente'} {item.crypto.designation}
                                                </Text>
                                                <Text className="text-sm text-gray-500">
                                                    {new Date(item.date_action).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className={`text-lg font-semibold ${type ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {type ? '+' : '-'}{formatCryptoAmount(item.quantite)}
                                            </Text>
                                            <Text className="text-sm text-gray-500">
                                                {formatCurrency(item.cours * item.quantite)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
