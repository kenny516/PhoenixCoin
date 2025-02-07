import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';

async function updatePushToken() {
    const user = auth.currentUser;
    if (!user) {
        console.log('Utilisateur non authentifié');
        return;
    }

    const userId = user.uid;
    const profilRef = doc(db, 'profil', userId);
    const profilCollection = collection(db, 'profil');

    try {
        // On récupère le nouveau token
        const newToken = await registerForPushNotificationsAsync();
        if (!newToken) return;

        // Chercher et mettre à jour les autres utilisateurs ayant le même token
        const sameTokenQuery = query(profilCollection, where('pushToken', '==', newToken));
        const sameTokenDocs = await getDocs(sameTokenQuery);

        // Mettre à jour les autres utilisateurs avec un token vide
        const updatePromises = sameTokenDocs.docs.map(doc => {
            if (doc.id !== userId) {
                return updateDoc(doc.ref, { pushToken: '' });
            }
        }).filter(Boolean);

        await Promise.all(updatePromises);

        // Mettre à jour le token de l'utilisateur courant
        const profilDoc = await getDoc(profilRef);

        if (profilDoc.exists()) {
            const profilData = profilDoc.data();
            if (profilData.pushToken !== newToken) {
                await updateDoc(profilRef, {
                    pushToken: newToken,
                });
                console.log('Token mis à jour avec succès');
            } else {
                console.log('Token déjà à jour');
            }
        } else {
            console.log('Profil utilisateur non trouvé');
            return;
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du token :', error);
        throw error;
    }
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('push token', token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export { updatePushToken, registerForPushNotificationsAsync };
