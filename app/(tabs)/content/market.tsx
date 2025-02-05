import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import BitcoinEvolutionChart from '@/components/ui/BitcoinEvolutionChart';
import { ChartDataPoint, CoursCrypto, Crypto } from '@/utils/type';



// Données statiques avec valeurs par défaut pour les nouvelles propriétés
const staticCryptos: CoursCrypto[] = [
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
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [graphContent, setGraphContent] = useState<ChartDataPoint[] | undefined>(undefined);
    const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        loadCrypto();
        //loadUserFavorites();
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

    const toggleFavorite = async (crypto: CoursCrypto) => {
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

    const loadCrypto = async () => {
        const listeCryptoRef = collection(db, "cryptomonnaies");
        const requette = query(listeCryptoRef);
        const resultats = await getDocs(requette);

        const listeCoursCrypto = new Set<Crypto>;
        resultats.forEach((doc) => {
            listeCoursCrypto.add({
                id: doc.data().id,
                designation: doc.data().designation,
            });
        })
        console.log(listeCoursCrypto);
        setCryptos(Array.from(listeCoursCrypto));

        if (cryptos?.length > 0) {
            showGraphOfCryptoSelected(cryptos[0]);
        }
        else {

        }
    }

    // prendre la liste cours_crypto 
    const onRefresh = async () => {
        setRefreshing(true);
        await loadCrypto();



        //setCryptos(staticCryptos);
        setRefreshing(false);
    };

    const showGraphOfCryptoSelected = async (crypto: Crypto) => {
        setSelectedCrypto(crypto);
        const listeCoursCryptoRef = collection(db, "cours_crypto");
        const requette = query(listeCoursCryptoRef, where("id_cryptomonnaie", "==", crypto.id));
        const resultats = await getDocs(requette);

        const listeCoursCrypto = new Set<ChartDataPoint>;
        resultats.forEach((doc) => {
            listeCoursCrypto.add({
                value: doc.data().cours_actuel,
                date: doc.data().date_cours
            });
        })

        setGraphContent(Array.from(listeCoursCrypto));
    }

    const renderCryptoItem = ({ item }: { item: Crypto }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-6 mb-2 bg-white border-gray-600 border-hairline rounded-xl"
            onPress={() => {
                showGraphOfCryptoSelected(item);
            }}>
            <View className="flex-row items-center">
                <Text className="ml-2 text-gray-500">{item.designation}</Text>
            </View>

            {/*            <View className="flex-row items-center">
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <Fontisto
                        name="favorite"
                        size={28}
                        color={item.isFavorite ? "#F59E0B" : "#dddddd"}
                    />
                </TouchableOpacity>
            </View> */}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 h-full bg-gray-50">
            <View className="p-6 bg-primary-600">
                <Text className="text-2xl font-bold text-white">Marché</Text>
            </View>
            <View className='w-full h-full gap-4 p-2'>
                {/* graphe herer */}
                <View className='w-full h-2/5'>
                    <BitcoinEvolutionChart
                        data={graphContent}
                    />
                </View>
                <View className='items-center w-full p-4 rounded-lg border-hairline h-3/6'>
                    <Text className='pb-2 text-xl font-bold '>Cryptomonnaies sur le marché</Text>
                    <FlatList
                        data={cryptos}
                        renderItem={renderCryptoItem}
                        keyExtractor={item => item.id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        contentContainerStyle={{ paddingBottom: 16 }} // Espace supplémentaire en bas
                        className="w-full py-4 -mb-4 border-t-hairline"
                        showsVerticalScrollIndicator={false}
                    />

                </View>
            </View>

        </SafeAreaView>
    );
}




