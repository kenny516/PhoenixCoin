import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                // Utiliser les données statiques en mode test
                setPortfolio(staticPortfolio);
                setTransactions(staticTransactions);
                return;
            }

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
        } catch (error) {
            console.error('Error loading portfolio:', error);
            // Fallback vers les données statiques en cas d'erreur
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
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center">
                <Text className="text-lg font-bold">{item.symbol}</Text>
                <Text className="ml-2 text-sm text-gray-500">
                    {item.totalAmount.toFixed(4)}
                </Text>
            </View>
            <Text className="text-lg font-medium">
                €{(item.totalAmount * item.currentPrice).toFixed(2)}
            </Text>
        </View>
    );

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
            <View>
                <Text className="text-lg font-medium">{item.cryptoSymbol}</Text>
                <Text className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>
            <View className="items-end">
                <Text className={item.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {item.type === 'buy' ? '+' : '-'}€{item.total.toFixed(2)}
                </Text>
                <Text className="text-sm text-gray-500">
                    {item.amount} @ €{item.price}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="p-6"
            >
                <Text className="text-2xl font-bold text-white">Portefeuille</Text>
                <View className="p-4 mt-4 bg-white/20 rounded-xl">
                    <Text className="text-sm text-white/80">Solde total</Text>
                    <Text className="text-3xl font-bold text-white">€{balance.toFixed(2)}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="p-4">
                    <Text className="mb-2 text-xl font-bold">Mes actifs</Text>
                    {portfolio.map(item => renderPortfolioItem({ item }))}
                </View>

                <View className="p-4">
                    <Text className="mb-2 text-xl font-bold">Historique</Text>
                    {transactions.map(item => renderTransaction({ item }))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
