import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';

interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    cryptoId: string;
    cryptoSymbol: string;
    amount: number;
    price: number;
    total: number;
    timestamp: Date;
}

interface PortfolioItem {
    cryptoId: string;
    symbol: string;
    totalAmount: number;
    currentPrice: number;
    profitLoss: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

const formatCryptoAmount = (amount: number) => {
    return amount < 0.01 ? amount.toFixed(8) : amount.toFixed(4);
};

// Données de test pour le portfolio
const staticPortfolio: PortfolioItem[] = [
    {
        cryptoId: 'bitcoin',
        symbol: 'BTC',
        totalAmount: 0.05,
        currentPrice: 35000,
        profitLoss: 250
    },
    {
        cryptoId: 'ethereum',
        symbol: 'ETH',
        totalAmount: 1.2,
        currentPrice: 2000,
        profitLoss: -100
    },
    {
        cryptoId: 'solana',
        symbol: 'SOL',
        totalAmount: 15,
        currentPrice: 150,
        profitLoss: 450
    }
];

// Données de test pour l'historique des transactions
const staticTransactions: Transaction[] = [
    {
        id: '1',
        type: 'buy',
        cryptoId: 'bitcoin',
        cryptoSymbol: 'BTC',
        amount: 0.03,
        price: 34000,
        total: 1020,
        timestamp: new Date('2024-01-15T10:30:00')
    },
    {
        id: '2',
        type: 'buy',
        cryptoId: 'ethereum',
        cryptoSymbol: 'ETH',
        amount: 0.8,
        price: 1950,
        total: 1560,
        timestamp: new Date('2024-01-14T15:45:00')
    },
    {
        id: '3',
        type: 'sell',
        cryptoId: 'solana',
        cryptoSymbol: 'SOL',
        amount: 5,
        price: 145,
        total: 725,
        timestamp: new Date('2024-01-13T09:20:00')
    },
    {
        id: '4',
        type: 'buy',
        cryptoId: 'bitcoin',
        cryptoSymbol: 'BTC',
        amount: 0.02,
        price: 35500,
        total: 710,
        timestamp: new Date('2024-01-12T14:15:00')
    },
    {
        id: '5',
        type: 'buy',
        cryptoId: 'solana',
        cryptoSymbol: 'SOL',
        amount: 20,
        price: 140,
        total: 2800,
        timestamp: new Date('2024-01-11T11:30:00')
    }
];

export default function PortfolioScreen() {
    const [balance, setBalance] = useState(5000);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>(staticPortfolio);
    const [transactions, setTransactions] = useState<Transaction[]>(staticTransactions);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Décommenter cette ligne pour charger les données
        loadPortfolioData();
    }, []);

    // Simplifier la fonction loadPortfolioData pour le mode test
    const loadPortfolioData = async () => {
        try {
            const user = auth.currentUser;
            // Pour le moment, utilisons toujours les données statiques
            setPortfolio(staticPortfolio);
            setTransactions(staticTransactions);

            // Si vous voulez tester avec Firebase plus tard, décommentez ce bloc
            /*
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
                        timestamp: data.timestamp.toDate()
                    } as Transaction);
                });

                setTransactions(transactionsList);
                calculatePortfolio(transactionsList);
            }
            */
        } catch (error) {
            console.error('Error loading portfolio:', error);
            setPortfolio(staticPortfolio);
            setTransactions(staticTransactions);
        }
    };

    const calculatePortfolio = (transactions: Transaction[]) => {
        const portfolioMap = new Map<string, PortfolioItem>();

        transactions.forEach(transaction => {
            const existing = portfolioMap.get(transaction.cryptoId) || {
                cryptoId: transaction.cryptoId,
                symbol: transaction.cryptoSymbol,
                totalAmount: 0,
                currentPrice: transaction.price, // Utiliser le dernier prix connu
                profitLoss: 0
            };

            if (transaction.type === 'buy') {
                existing.totalAmount += transaction.amount;
            } else {
                existing.totalAmount -= transaction.amount;
            }

            portfolioMap.set(transaction.cryptoId, existing);
        });

        setPortfolio(Array.from(portfolioMap.values()));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPortfolioData();
        setRefreshing(false);
    };

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
                    <Text className="text-sm text-gray-500">
                        {formatCryptoAmount(item.totalAmount)} {item.symbol}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-lg font-medium">
                    {formatCurrency(item.totalAmount * item.currentPrice)}
                </Text>
                <View className="flex-row items-center">
                    <MaterialIcons
                        name={item.profitLoss >= 0 ? "trending-up" : "trending-down"}
                        size={16}
                        color={item.profitLoss >= 0 ? "#16a34a" : "#dc2626"}
                    />
                    <Text className={`ml-1 ${item.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.profitLoss >= 0 ? "+" : ""}{formatCurrency(item.profitLoss)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View className="flex-row items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm">
            <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.type === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <MaterialIcons
                        name={item.type === 'buy' ? "call-received" : "call-made"}
                        size={20}
                        color={item.type === 'buy' ? "#16a34a" : "#dc2626"}
                    />
                </View>
                <View>
                    <Text className="text-lg font-medium">{item.cryptoSymbol}</Text>
                    <Text className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className={`text-lg ${item.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'buy' ? '+' : '-'}{formatCurrency(item.total)}
                </Text>
                <Text className="text-sm text-gray-500">
                    {formatCryptoAmount(item.amount)} @ {formatCurrency(item.price)}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="p-6"
            >
                <Text className="mb-4 text-2xl font-bold text-white">Mon Portefeuille</Text>
                <View className="p-5 bg-white/20 rounded-xl">
                    <Text className="mb-1 text-sm text-white/90">Solde total</Text>
                    <Text className="text-4xl font-bold text-white">
                        {formatCurrency(balance)}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="p-4">
                    <Text className="mb-3 text-xl font-bold text-gray-800">Mes actifs</Text>
                    {portfolio?.map((item, index) => (
                        <View key={index}>
                            {renderPortfolioItem({ item })}
                        </View>
                    ))}
                </View>

                <View className="p-4">
                    <Text className="mb-3 text-xl font-bold text-gray-800">Transactions récentes</Text>
                    {transactions?.map((item, index) => (
                        <View key={index}>
                            {renderTransaction({ item })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
