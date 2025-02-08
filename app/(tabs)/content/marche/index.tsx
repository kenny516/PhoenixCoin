import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import BitcoinEvolutionChart from '@/components/ui/BitcoinEvolutionChart';
import { ChartDataPoint, CoursCrypto, Crypto } from '@/utils/type';
import Toast from 'react-native-toast-message';
import { EvilIcons, FontAwesome, Fontisto } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

export default function MarketScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [graphContent, setGraphContent] = useState<ChartDataPoint[] | undefined>(undefined);
    const [selectedCrypto, setSelectedCrypto] = useState<Crypto>();
    const [refreshing, setRefreshing] = useState(false);
    const [loadingFavorites, setLoadingFavorites] = useState<Record<string, boolean>>({});
    const [isGraphLoading, setIsGraphLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadCrypto().finally(() => {
            setIsLoading(false);
            loadUserFavorites();
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

    const toggleFavorite = async (crypto: Crypto) => {
        try {
            setLoadingFavorites(prev => ({ ...prev, [crypto.id]: true }));
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
                /*                Toast.show({
                                   type: "success",
                                   text1: "Favoris",
                                   text2: "Crypto-monnaie retirée des favoris",
                               }); */
            } else {
                // Ajouter aux favoris
                await addDoc(favoritesRef, {
                    userId: user.uid,
                    cryptoId: crypto.id,
                });
                /*              Toast.show({
                                 type: "success",
                                 text1: "Favoris",
                                 text2: "Crypto-monnaie ajoutée aux favoris",
                             }); */
            }

            setCryptos(currentCryptos =>
                currentCryptos.map(c =>
                    c.id === crypto.id
                        ? { ...c, isFavorite: !crypto.isFavorite }
                        : c
                )
            );

            await new Promise(resolve => setTimeout(resolve, 500)); // Simulation de délai

        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour les favoris');
        } finally {
            setLoadingFavorites(prev => ({ ...prev, [crypto.id]: false }));
        }
    };

    const loadCrypto = async () => {
        try {
            console.log("Début du chargement des cryptos");
            const listeCryptoRef = collection(db, "cryptomonnaies");
            const requette = query(listeCryptoRef);
            const resultats = await getDocs(requette);

            const listeCoursCrypto: Crypto[] = [];

            // Vérification si des données existent
            if (resultats.empty) {
                console.log("Aucune cryptomonnaie trouvée dans la base de données");
                Toast.show({
                    type: "info",
                    text1: "Information",
                    text2: "Aucune cryptomonnaie disponible pour le moment",
                });
                return;
            }
            ////////// il faudrais remplacer doc.data().id par doc.id
            resultats.forEach((doc) => {
                console.log("Crypto trouvée:", doc.data());
                listeCoursCrypto.push({
                    id: doc.data().id, // Utilisation de doc.id au lieu de doc.data().id
                    designation: doc.data().designation || "Crypto sans nom",
                    isFavorite: false
                });
            });

            console.log("Nombre de cryptos chargées:", listeCoursCrypto.length);
            console.log("Liste des cryptos:", listeCoursCrypto);

            setCryptos(listeCoursCrypto);

            // Si on a des cryptos, on affiche le graphe de la première
            if (listeCoursCrypto.length > 0) {
                await showGraphOfCryptoSelected(listeCoursCrypto[0]);
            }
        } catch (error) {
            console.error("Erreur détaillée lors du chargement des cryptos:", error);
        }
    };

    // Modification du showGraphOfCryptoSelected pour une meilleure gestion des erreurs
    const showGraphOfCryptoSelected = async (crypto: Crypto) => {
        setIsGraphLoading(prev => ({ ...prev, [crypto.id]: true }));
        try {
            console.log("Chargement du graphique pour:", crypto.designation);

            const listeCoursCryptoRef = collection(db, "cours_crypto");
            const requette = query(listeCoursCryptoRef, where("id_cryptomonnaie", "==", crypto.id));
            console.log(crypto);

            const resultats = await getDocs(requette);

            const listeCoursCrypto = new Set<ChartDataPoint>();

            if (resultats.empty) {
                console.log("Aucun cours trouvé pour cette crypto");
                Toast.show({
                    type: "info",
                    text1: "Information",
                    text2: "Aucun historique de cours disponible pour " + crypto.designation,
                });
                return;
            }
            setSelectedCrypto(crypto);

            resultats.forEach((doc) => {
                listeCoursCrypto.add({
                    value: doc.data().cours_actuel || 0,
                    date: doc.data().date_cours || new Date().toISOString()
                });
            });

            console.log("Nombre de points de données:", listeCoursCrypto.size);
            setGraphContent(Array.from(listeCoursCrypto));
        } catch (error) {
            console.error("Erreur lors du chargement du graphique:", error);
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Impossible de charger le graphique veuillez réessayer",
            });
        } finally {
            setIsGraphLoading(prev => ({ ...prev, [crypto.id]: false }));
        }
    };
    // call tous les 10 seconde du showGraphOfCryptoSelected 
    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedCrypto) {
                showGraphOfCryptoSelected(selectedCrypto);
                console.log("call");

            }
        }, 10000);
        return () => clearInterval(interval);
    }, [selectedCrypto]);



    const renderCryptoItem = ({ item, index }: { item: Crypto, index: number }) => (
        <Animated.View
            className="mb-2"
        >
            <View className="flex-row items-center justify-between p-4 bg-white shadow-sm gap-7 rounded-2xl">
                {/* Partie gauche avec icône et nom */}
                <View className="flex-row items-center flex-1">
                    <View className="items-center justify-center w-12 h-12 mr-4 bg-primary-100 rounded-xl">
                        <Text className="text-xl font-semibold text-primary-600">
                            {item.designation[0].toUpperCase()}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                            {item.designation}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            Crypto-monnaie
                        </Text>
                    </View>
                </View>

                {/* Partie droite avec bouton favori */}
                <TouchableOpacity
                    onPress={() => showGraphOfCryptoSelected(item)}
                    className="items-center justify-center w-10 h-10 bg-primary-100 rounded-xl"
                >
                    {isGraphLoading[item.id] ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <Animated.View>
                            <FontAwesome name="line-chart" size={24} color="#1D4ED8" />
                        </Animated.View>
                    )}
                </TouchableOpacity>


                {/* Partie droite avec bouton favori */}
                <TouchableOpacity
                    onPress={() => !loadingFavorites[item.id] && toggleFavorite(item)}
                    disabled={loadingFavorites[item.id]}
                    className="items-center justify-center w-10 h-10 bg-primary-100 rounded-xl"
                >
                    {loadingFavorites[item.id] ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <Animated.View>
                            <Fontisto
                                name="favorite"
                                size={24}
                                color={item.isFavorite ? '#FFB800' : '#9CA3AF'}
                            />
                        </Animated.View>
                    )}
                </TouchableOpacity>
            </View>
        </Animated.View>
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




