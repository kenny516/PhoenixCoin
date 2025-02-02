import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { setupNotifications, sendPriceChangeNotification } from '@/utils/notifications';

// Type pour une crypto-monnaie
interface Crypto {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    isFavorite?: boolean;
}

// Données statiques
const staticCryptos: Crypto[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 35000,
        priceChangePercentage24h: 2.5,
        isFavorite: false
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 2000,
        priceChangePercentage24h: -1.2,
        isFavorite: false
    },
    {
        id: 'ripple',
        symbol: 'XRP',
        name: 'Ripple',
        currentPrice: 0.5,
        priceChangePercentage24h: 5.8,
        isFavorite: false
    },
    {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        currentPrice: 1.2,
        priceChangePercentage24h: -0.7,
        isFavorite: false
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: 150,
        priceChangePercentage24h: 8.3,
        isFavorite: false
    }
];

export default function MarketScreen() {
    const [cryptos, setCryptos] = useState<Crypto[]>(staticCryptos);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await setupNotifications();
                //await loadUserFavorites();
                setError(null);
            } catch (err) {
                setError("Erreur de connexion");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        //initializeApp();
        //const interval = setInterval(checkPriceChanges, 30000);
        //return () => clearInterval(interval);
    }, []);

    const checkPriceChanges = () => {
        cryptos.forEach(crypto => {
            if (crypto.isFavorite) {
                const newPrice = crypto.currentPrice * (1 + (Math.random() * 0.1 - 0.05));
                const change = ((newPrice - crypto.currentPrice) / crypto.currentPrice) * 100;
                if (Math.abs(change) > 1) {
                    sendPriceChangeNotification(crypto.name, change);
                }
            }
        });
    };

    const loadUserFavorites = async () => {
        try {
            setIsLoading(true);
            const user = auth.currentUser;
            if (!user) throw new Error('Utilisateur non connecté');

            const favoritesRef = collection(db, "favorites");
            const q = query(favoritesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const favoriteIds = new Set();
            querySnapshot.forEach((doc) => {
                favoriteIds.add(doc.data().cryptoId);
            });

            setCryptos(currentCryptos =>
                currentCryptos.map(crypto => ({
                    ...crypto,
                    isFavorite: favoriteIds.has(crypto.id)
                }))
            );
        } catch (error) {
            console.error('Error loading favorites:', error);
            setError("Erreur lors du chargement des favoris");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async (crypto: Crypto) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user');

            const favoritesRef = collection(db, "favorites");
            const q = query(
                favoritesRef,
                where("userId", "==", user.uid),
                where("cryptoId", "==", crypto.id)
            );

            const querySnapshot = await getDocs(q);

            if (crypto.isFavorite) {
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            } else {
                await addDoc(favoritesRef, {
                    userId: user.uid,
                    cryptoId: crypto.id,
                    createdAt: new Date()
                });
                await sendPriceChangeNotification(
                    crypto.name,
                    0,
                    "Crypto ajoutée aux favoris"
                );
            }

            setCryptos(cryptos.map(c =>
                c.id === crypto.id
                    ? { ...c, isFavorite: !c.isFavorite }
                    : c
            ));
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour les favoris');
        }
    };

    /*     const onRefresh = () => {
            setRefreshing(true);
            // Simuler un délai de chargement
            setTimeout(() => {
                setCryptos(staticCryptos);
                setRefreshing(false);
            }, 1000);
        }; */

    const renderCryptoItem = ({ item }: { item: Crypto }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100"
            onPress={() => {/* Navigation vers détails */ }}>
            <View className="flex-row items-center">
                <Text className="text-lg font-bold">{item.symbol}</Text>
                <Text className="ml-2 text-gray-500">{item.name}</Text>
            </View>

            <View className="flex-row items-center">
                <Text className="mr-4 text-lg font-medium">
                    €{item.currentPrice.toLocaleString()}
                </Text>
                <Text className={`mr-4 ${item.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {item.priceChangePercentage24h.toFixed(2)}%
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <MaterialCommunityIcons
                        name={item.isFavorite ? "star" : "star-o"}
                        size={24}
                        color={item.isFavorite ? "#F59E0B" : "#9CA3AF"}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 bg-primary-600">
                <Text className="text-2xl font-bold text-white">Marché</Text>
            </View>

            {error && (
                <View className="p-4 bg-red-100">
                    <Text className="text-red-600">{error}</Text>
                    <TouchableOpacity
                        className="p-2 mt-2 bg-red-500 rounded"
                        onPress={() => loadUserFavorites()}>
                        <Text className="text-white">Réessayer</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isLoading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={cryptos}
                    renderItem={renderCryptoItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                        //onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}