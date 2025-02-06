import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import BitcoinEvolutionChart from '@/components/ui/BitcoinEvolutionChart';
import { ChartDataPoint, CoursCrypto, Crypto } from '@/utils/type';
import Toast from 'react-native-toast-message';


// ajoute moi un loading lors du fetch de donne avant d afficher le contenue
export default function MarketScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [graphContent, setGraphContent] = useState<ChartDataPoint[] | undefined>(undefined);
    const [selectedCrypto, setSelectedCrypto] = useState<Crypto>();
    const [refreshing, setRefreshing] = useState(false);



    useEffect(() => {
        loadCrypto().finally(() => {
            setIsLoading(false);
        });
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
            Toast.show({
                type: "error",
                text1: "Erreur de connection",
                text2: "Veuillez verifier votre connection internet 🛜",
            });
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
        try {
            const listeCryptoRef = collection(db, "cryptomonnaies");
            const requette = query(listeCryptoRef);
            const resultats = await getDocs(requette);

            const listeCoursCrypto: Crypto[] = [];
            resultats.forEach((doc) => {
                listeCoursCrypto.push({
                    id: doc.data().id,
                    designation: doc.data().designation,
                });
            });

            setCryptos(listeCoursCrypto);

            // Si on a des cryptos, on affiche le graphe de la première
            if (listeCoursCrypto.length > 0) {
                await showGraphOfCryptoSelected(listeCoursCrypto[0]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cryptos:", error);
            Alert.alert("Erreur", "Impossible de charger les cryptomonnaies");
        }
    };

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
                <View className="items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                    <Text className="text-lg font-bold text-blue-600">{item.designation[0].toUpperCase()}</Text>
                </View>
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
            <View className="p-4 bg-primary-600">
                <Text className="text-2xl font-bold text-white">Marché</Text>
            </View>
            {isLoading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-2">Chargement des données...</Text>
                </View>
            ) : (
                <View className='justify-start w-full h-full p-2 gap-8 flex-[2]'>
                    <View className='w-full h-2/5'>
                        <BitcoinEvolutionChart
                            data={graphContent}
                            title={selectedCrypto?.designation}
                        />
                    </View>
                    <View className='items-center w-full h-auto p-4 rounded-lg border-hairline'>
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
            )}
        </SafeAreaView>
    );
}




