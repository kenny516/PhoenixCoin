import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
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
            className="flex-row items-center justify-between p-3 mb-2 bg-white border-gray-600 border-hairline rounded-xl"
            style={{
                paddingVertical: Dimensions.get('window').height * 0.015,
                paddingHorizontal: Dimensions.get('window').width * 0.03
            }}
            onPress={() => {
                showGraphOfCryptoSelected(item);
            }}>

            <View className="flex-row items-center">
                <View style={{
                    width: Dimensions.get('window').width * 0.1,
                    height: Dimensions.get('window').width * 0.1,
                    marginRight: Dimensions.get('window').width * 0.02
                }} className="items-center justify-center bg-blue-100 rounded-full">
                    <Text style={{
                        fontSize: Dimensions.get('window').width * 0.04
                    }} className="font-bold text-blue-600">{item.designation[0].toUpperCase()}</Text>
                </View>
                <Text style={{
                    fontSize: Dimensions.get('window').width * 0.035
                }} className="text-gray-500">{item.designation}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 h-full bg-gray-50">
            <View style={{
                padding: Dimensions.get('window').width * 0.03,
                marginBottom: Dimensions.get('window').height * 0.01
            }} className="bg-primary-600">
                <Text style={{
                    fontSize: Dimensions.get('window').width * 0.05,
                    color: '#ffffff'
                }} className="font-bold">Marché</Text>
            </View>
            {isLoading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-2">Chargement des données...</Text>
                </View>
            ) : (
                <View style={{
                    flex: 1,
                    gap: Dimensions.get('window').height * 0.02,
                    padding: Dimensions.get('window').width * 0.03
                }}>
                    <View style={{
                        height: Math.min(Dimensions.get('window').height * 0.4, 300),
                        padding: Dimensions.get('window').width * 0.02,
                        backgroundColor: '#f1f5f9',
                        borderRadius: 12
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <BitcoinEvolutionChart
                                data={graphContent}
                                title={selectedCrypto?.designation}
                            />
                        </ScrollView>
                    </View>
                    <View style={{
                        flex: 1,
                        padding: Dimensions.get('window').width * 0.02,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#e5e7eb'
                    }}>
                        <Text style={{
                            fontSize: Dimensions.get('window').width * 0.045,
                            marginBottom: Dimensions.get('window').height * 0.01,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            Cryptomonnaies sur le marché
                        </Text>
                        <FlatList
                            data={cryptos}
                            renderItem={renderCryptoItem}
                            keyExtractor={item => item.id}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            contentContainerStyle={{
                                paddingBottom: Dimensions.get('window').height * 0.02
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}




