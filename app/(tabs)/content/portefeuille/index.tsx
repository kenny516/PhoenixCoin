import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView, TextInput, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { BlurView } from 'expo-blur';
import { collection, query, where, getDocs, doc, orderBy, getDoc } from 'firebase/firestore';
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
        currency: 'EUR',
    }).format(value);
};

const formatCryptoAmount = (amount: number) => {
    return amount < 0.01 ? amount.toFixed(8) : amount.toFixed(4);
};

export default function PortfolioScreen() {
    const [profil, setProfil] = useState<Profil>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isloading, setIsLoading] = useState(true)
    const scrollY = new Animated.Value(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        calculatePortfolio([]);
        setTransactions([]);
        loadPortfolioData();
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const profilRef = doc(db, "profil", user.uid);
                const resultat = await getDoc(profilRef);

                if (resultat.exists()) {
                    const data = resultat.data();
                    console.log("Profil :", data);

                    setProfil({
                        id: resultat.id,
                        nom: data.nom,
                        fondActuel: data.fondActuel,
                    });
                } else {
                    console.log("Aucun profil trouvé !");
                }
            }
        } catch (error) {
            console.error("Error loading profil:", error);
        }
    };

    const loadPortfolioData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const transactionsRef = collection(db, "transactions_crypto");
                const q = query(
                    transactionsRef,
                    where("profil", "==", user.uid),
                    orderBy("dateAction", "desc")
                );
                const querySnapshot = await getDocs(q);
                const transactionsList: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    transactionsList.push({
                        id: doc.id,
                        dateAction: data.dateAction,
                        cours: data.cours,
                        quantite: data.quantite,
                        profil: data.profil,
                        crypto: data.crypto,
                        typeTransaction: data.typeTransaction,
                    });
                });
                setTransactions(transactionsList);
                calculatePortfolio(transactionsList);
            }
        } catch (error) {
            console.error("An error occurred while loading portfolio:", error);
        }
    };

    // Calculer le portefeuille à partir des transactions en regroupant par crypto
    const calculatePortfolio = (transactions: Transaction[]) => {
        const portfolioMap = new Map<string, PortfolioItem>();

        transactions.forEach((transaction) => {
            const cryptoId = transaction.crypto;
            const type = transaction.typeTransaction.toLowerCase(); // 'achat' ou 'vente'
            const quantite = transaction.quantite;

            let item = portfolioMap.get(cryptoId);
            if (!item) {
                item = {
                    cryptoId,
                    symbol: transaction.crypto,
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
        await loadProfile();
        setRefreshing(false);
    };

    // Animation du header
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [220, 150],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.98],
        extrapolate: 'clamp'
    });

    return (
        <SafeAreaView className="flex-1">
            <Animated.View
                style={{
                    height: headerHeight,
                    opacity: headerOpacity
                }}
                className="relative"
            >
                <LinearGradient
                    colors={['#2563EB', '#1D4ED8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute w-full h-full"
                />


                <View className="px-6 pt-4">
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 500 }}
                    >
                        <Text className="mb-2 text-sm font-medium text-primary-200">Balance totale</Text>
                        <Text className="mb-4 text-4xl font-bold text-white">
                            {formatCurrency(profil?.fondActuel ?? 0)}
                        </Text>
                    </MotiView>

                    <View className="flex-row p-4 space-x-4 gap-7">
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 200 }}
                            className="flex-1 p-4 bg-white/10 rounded-2xl "
                        >
                            <FontAwesome5 name="coins" size={20} color="#93C5FD" />
                            <Text className="mt-2 text-xs text-primary-200">Cryptos</Text>
                            <Text className="text-2xl font-bold text-white">{portfolio.length}</Text>
                        </MotiView>
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 400 }}
                            className="flex-1 p-4 bg-white/10 rounded-2xl"
                        >
                            <FontAwesome5 name="exchange-alt" size={20} color="#93C5FD" />
                            <Text className="mt-2 text-xs text-primary-200">Transactions</Text>
                            <Text className="text-2xl font-bold text-white">{transactions.length}</Text>
                        </MotiView>
                    </View>
                </View>
            </Animated.View>


            <Animated.ScrollView
                className="flex-1"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#2563EB"
                    />
                }
            >
                {/* Section des actifs */}
                <View className="p-4">
                    <Text className="mb-4 text-xl font-bold text-primary-900">Mes actifs</Text>
                    {portfolio
                        .filter(item => item.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item, index) => (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 100 }}
                                className="p-4 mb-3 bg-white shadow-sm rounded-2xl"
                            >
                                <TouchableOpacity className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-primary-100">
                                            <Text className="text-xl font-bold text-primary-600">{item.symbol[0]}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-lg font-semibold text-primary-900">{item.symbol}</Text>
                                        </View>
                                    </View>
                                    <View className="p-2 bg-primary-50 rounded-xl">
                                        <View>
                                            <Text className="text-sm text-primary-500">
                                                {formatCryptoAmount(item.quantite)} unités
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                </View>

                {/* Section des transactions */}
                <View className="p-4">
                    <Text className="mb-4 text-xl font-bold text-primary-900">Transactions récentes</Text>
                    {transactions.map((item, index) => {
                        const isAchat = item.typeTransaction.toLowerCase() === 'achat';
                        return (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: index * 50 }}
                                className="p-4 mb-3 bg-white shadow-sm rounded-2xl"
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isAchat ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            <MaterialIcons
                                                name={isAchat ? 'arrow-downward' : 'arrow-upward'}
                                                size={20}
                                                color={isAchat ? '#059669' : '#DC2626'}
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-base font-semibold text-primary-900">
                                                {isAchat ? 'Achat' : 'Vente'} {item.crypto}
                                            </Text>
                                            <Text className="text-sm text-primary-500">
                                                {new Date(item.dateAction).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className={`text-base font-semibold ${isAchat ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {isAchat ? '+' : '-'}{formatCryptoAmount(item.quantite)}
                                        </Text>
                                        <Text className="text-sm text-primary-500">
                                            {formatCurrency(item.cours * item.quantite)}
                                        </Text>
                                    </View>
                                </View>
                            </MotiView>
                        );
                    })}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
