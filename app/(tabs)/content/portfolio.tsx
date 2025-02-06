import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import {
    Transaction,
} from '@/utils/type';

// Type utilisé pour chaque élément du portefeuille calculé
export type PortfolioItem = {
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

export default function PortfolioScreen() {
    const [balance, setBalance] = useState(5000);
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
            /*
            const user = auth.currentUser;
            if (user) {
              const transactionsRef = collection(db, "transactions");
              const q = query(transactionsRef, where("userId", "==", user.uid));
              const querySnapshot = await getDocs(q);
              const transactionsList: Transaction[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                transactionsList.push({
                  id: doc.id,
                  ...data,
                  date_action: data.date_action.toDate().toISOString()
                } as Transaction);
              });
              setTransactions(transactionsList);
              calculatePortfolio(transactionsList);
            }
            */
            // Pour le test, nous utilisons les données statiques
            setTransactions(staticTransactions);
            calculatePortfolio(staticTransactions);
        } catch (error) {
            console.error('Error loading portfolio:', error);
            setTransactions(staticTransactions);
            calculatePortfolio(staticTransactions);
        }
    };

    // Calculer le portefeuille à partir des transactions en regroupant par crypto
    const calculatePortfolio = (transactions: Transaction[]) => {
        const portfolioMap = new Map<string, PortfolioItem>();

        transactions.forEach((transaction) => {
            const cryptoId = transaction.crypto.id;
            const type = transaction.transaction.designation.toLowerCase(); // 'achat' ou 'vente'
            const quantite = transaction.quantite;

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

    // Rendu d'un élément du portefeuille
    const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center flex-1">
                <View className="items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                    <Text className="text-lg font-bold text-blue-600">{item.symbol[0]}</Text>
                </View>
                <View>
                    <Text className="text-lg font-bold">{item.symbol}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-lg font-medium">
                    {item.quantite}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Rendu d'une transaction
    const renderTransaction = ({ item }: { item: Transaction }) => {
        const type = item.transaction.designation.toLowerCase() === 'achat' ? 'buy' : 'sell';
        const cryptoSymbol = item.crypto.designation;
        const timestamp = new Date(item.date_action);
        const total = item.cours * item.quantite;
        const amount = item.quantite;
        const price = item.cours;

        return (
            <View className="flex-row items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm">
                <View className="flex-row items-center flex-1">
                    <View
                        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                            }`}
                    >
                        <MaterialIcons
                            name={type === 'buy' ? 'call-received' : 'call-made'}
                            size={20}
                            color={type === 'buy' ? '#16a34a' : '#dc2626'}
                        />
                    </View>
                    <View>
                        <Text className="text-lg font-medium">{cryptoSymbol}</Text>
                        <Text className="text-sm text-gray-500">
                            {timestamp.toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className={`text-lg ${type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                        {type === 'buy' ? '+' : '-'}
                        {formatCurrency(total)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {formatCryptoAmount(amount)} @ {formatCurrency(price)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <LinearGradient colors={['#3B82F6', '#2563EB']} className="p-6">
                <Text className="mb-4 text-2xl font-bold text-white">Mon Portefeuille</Text>
                <View className="p-5 bg-white/20 rounded-xl">
                    <Text className="mb-1 text-sm text-white/90">Solde total</Text>
                    <Text className="text-4xl font-bold text-white">{formatCurrency(balance)}</Text>
                </View>
            </LinearGradient>

            <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="p-4">
                    <Text className="mb-4 text-xl font-bold text-gray-800">Mes actifs</Text>
                    {portfolio.map((item, index) => (
                        <View key={index}>{renderPortfolioItem({ item })}</View>
                    ))}
                </View>

                <View className="p-4">
                    <Text className="mb-4 text-xl font-bold text-gray-800">Transactions récentes</Text>
                    {transactions.map((item, index) => (
                        <View key={index}>{renderTransaction({ item })}</View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
