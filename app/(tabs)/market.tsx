import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { firestore } from '@/firebase/firebaseConfig';

// Type pour une crypto-monnaie
interface Crypto {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercentage24h: number;
  isFavorite?: boolean;
}

export default function MarketScreen() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Demander la permission pour les notifications
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Vous devez autoriser les notifications pour être informé des changements de prix');
    }
  };

  // Charger les cryptos
  const fetchCryptos = async () => {
    try {
      // Ici, vous devrez implémenter l'appel à votre API de crypto
      // Par exemple avec CoinGecko ou une autre API
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur'
      );
      const data = await response.json();
      setCryptos(data.map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        currentPrice: crypto.current_price,
        priceChangePercentage24h: crypto.price_change_percentage_24h,
        isFavorite: favorites.includes(crypto.id)
      })));
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de charger les cours');
    }
  };

  // Gérer les favoris
  const toggleFavorite = async (crypto: Crypto) => {
    try {
      if (crypto.isFavorite) {
        // Retirer des favoris
        setFavorites(favorites.filter(id => id !== crypto.id));
      } else {
        // Ajouter aux favoris
        setFavorites([...favorites, crypto.id]);
        // Enregistrer dans Firestore
        await addDoc(collection(firestore, 'favorites'), {
          userId: 'USER_ID', // À remplacer par l'ID de l'utilisateur connecté
          cryptoId: crypto.id,
          alertPrice: crypto.currentPrice
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de mettre à jour les favoris');
    }
  };

  const renderCryptoItem = ({ item }: { item: Crypto }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100"
      onPress={() => {/* Navigation vers détails */}}>
      <View className="flex-row items-center">
        <Text className="text-lg font-bold">{item.symbol}</Text>
        <Text className="ml-2 text-gray-500">{item.name}</Text>
      </View>
      
      <View className="flex-row items-center">
        <Text className="mr-4 text-lg font-medium">
          €{item.currentPrice.toLocaleString()}
        </Text>
        <Text className={`mr-4 ${
          item.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {item.priceChangePercentage24h.toFixed(2)}%
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Feather 
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

      <FlatList
        data={cryptos}
        renderItem={renderCryptoItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchCryptos}
          />
        }
      />
    </SafeAreaView>
  );
}