import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { LineChart } from 'react-native-gifted-charts';
import BitcoinEvolutionChart from '@/components/ui/BitcoinEvolutionChart';

// Type pour une crypto-monnaie
type Crypto = {
    id: string;
    designation: string;
    name: string;
    coursActuel: number;
    dateCours: Date;
    priceChangePercentage24h: number; // Pourcentage de changement sur 24h
    isFavorite?: boolean; // Champ optionnel pour savoir si c'est un favori
};

// Données statiques avec valeurs par défaut pour les nouvelles propriétés
const staticCryptos: Crypto[] = [
    {
        id: '1',
        designation: 'BTC',
        name: 'Bitcoin',
        coursActuel: 39000,
        dateCours: new Date(),
        priceChangePercentage24h: 2.5,
        isFavorite: false,
    },
    {
        id: '2',
        designation: 'ETH',
        name: 'Ethereum',
        coursActuel: 2200,
        dateCours: new Date(),
        priceChangePercentage24h: -1.3,
        isFavorite: false,
    },
    {
        id: '3',
        designation: 'BNB',
        name: 'Binance Coin',
        coursActuel: 300,
        dateCours: new Date(),
        priceChangePercentage24h: 0.8,
        isFavorite: false,
    },
    {
        id: '4',
        designation: 'ETH',
        name: 'Ethereum',
        coursActuel: 2200,
        dateCours: new Date(),
        priceChangePercentage24h: -1.3,
        isFavorite: false,
    },
    {
        id: '5',
        designation: 'BNB',
        name: 'Binance Coin',
        coursActuel: 300,
        dateCours: new Date(),
        priceChangePercentage24h: 0.8,
        isFavorite: false,
    },
    {
        id: '6',
        designation: 'ETH',
        name: 'Ethereum',
        coursActuel: 2200,
        dateCours: new Date(),
        priceChangePercentage24h: -1.3,
        isFavorite: false,
    },
    {
        id: '7',
        designation: 'BNB',
        name: 'Binance Coin',
        coursActuel: 300,
        dateCours: new Date(),
        priceChangePercentage24h: 0.8,
        isFavorite: false,
    }
];
const mockChartData = [
    { value: 37000, date: '1 Jan' },
    { value: 37500, date: '2 Jan' },
    { value: 39000, date: '3 Jan' },
    { value: 38500, date: '4 Jan' },
    { value: 40000, date: '5 Jan' },
    { value: 39500, date: '6 Jan' },
    { value: 39000, date: '7 Jan' },
];

export default function MarketScreen() {
    const [cryptos, setCryptos] = useState<Crypto[]>(staticCryptos);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadUserFavorites();
    }, []);

    const loadUserFavorites = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const favoritesRef = collection(db, "favorites");
                const q = query(favoritesRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const favoriteIds = new Set<string>();
                querySnapshot.forEach((doc) => {
                    favoriteIds.add(doc.data().cryptoId);
                });

                setCryptos(currentCryptos =>
                    currentCryptos.map(crypto => ({
                        ...crypto,
                        isFavorite: favoriteIds.has(crypto.id)
                    }))
                );
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
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
                // Supprimer les favoris
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            } else {
                // Ajouter aux favoris
                await addDoc(favoritesRef, {
                    userId: user.uid,
                    cryptoId: crypto.id,
                    createdAt: new Date()
                });
            }

            // Mise à jour locale de l'état
            setCryptos(currentCryptos =>
                currentCryptos.map(c =>
                    c.id === crypto.id
                        ? { ...c, isFavorite: !crypto.isFavorite }
                        : c
                )
            );
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour les favoris');
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simuler un délai de chargement
        setTimeout(() => {
            setCryptos(staticCryptos);
            setRefreshing(false);
        }, 1000);
    };

    const renderCryptoItem = ({ item }: { item: Crypto }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-6 mb-2 bg-white border-gray-600 border-hairline rounded-xl"
            onPress={() => { /* Navigation vers détails */ }}>
            <View className="flex-row items-center">
                <Text className="ml-2 text-gray-500">{item.name}</Text>
            </View>

            <View className="flex-row items-center">
                <Text className="mr-4 text-lg font-medium">
                    €{item.coursActuel.toLocaleString()}
                </Text>
                <Text className={`mr-4 ${item.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.priceChangePercentage24h.toFixed(2)}%
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <MaterialCommunityIcons
                        name={item.isFavorite ? "star" : "star-outline"}
                        size={24}
                        color={item.isFavorite ? "#F59E0B" : "#9CA3AF"}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 h-full bg-gray-50">
            <View className="p-6 bg-primary-600">
                <Text className="text-2xl font-bold text-white">Marché</Text>
            </View>
            <View className='w-full h-full gap-2 p-2'>
                {/* graphe herer */}

                <View className='w-full h-2/5 '>
                    <BitcoinEvolutionChart />
                </View>
                <View className='p-4 rounded-lg border-hairline h-3/6'>
                    <Text className='pb-2 text-xl '>Liste des cours cryptomonnaies</Text>
                    <FlatList
                        data={cryptos}
                        renderItem={renderCryptoItem}
                        keyExtractor={item => item.id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        contentContainerStyle={{ paddingBottom: 16 }} // Espace supplémentaire en bas
                        className="py-4 -mb-4 border-t-hairline"
                        showsVerticalScrollIndicator={false}
                    />

                </View>
            </View>

        </SafeAreaView>
    );
}
