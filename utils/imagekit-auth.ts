import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import Constants from 'expo-constants';

interface AuthParams {
    token: string;
    expire: number;
    signature: string;
}

class ImageKitAuth {
    private privateKey: string;
    private publicKey: string;
    private db;

    constructor() {
        // Utiliser des variables d'environnement
        this.privateKey = Constants.expoConfig?.extra?.imageKitPrivateKey || "";
        this.publicKey = Constants.expoConfig?.extra?.imageKitPublicKey || "",
            this.db = getFirestore();
    }

    private getExpireTimestamp(): number {
        return Math.floor(Date.now() / 1000) + (30 * 60);
    }

    private generateToken(): string {
        try {
            // Méthode principale
            if (typeof window !== 'undefined' && window.crypto) {
                const array = new Uint8Array(16);
                window.crypto.getRandomValues(array);
                return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            }

            // Fallback 1
            const timestamp = Date.now().toString();
            const random = Math.random().toString(36).substring(2);
            return CryptoJS.SHA256(timestamp + random).toString().substring(0, 32);
        } catch (error) {
            // Fallback 2
            console.warn('Fallback token generation used');
            return CryptoJS.SHA256(Date.now().toString()).toString().substring(0, 32);
        }
    }

    private generateSignature(token: string, expire: number): string {
        try {
            const signatureString = token + expire.toString();
            return CryptoJS.HmacSHA1(signatureString, this.privateKey).toString();
        } catch (error) {
            throw new Error('Erreur de génération de signature');
        }
    }

    public async getAuthenticationParameters(): Promise<AuthParams> {
        try {
            if (!this.privateKey || !this.publicKey) {
                throw new Error('Clés d\'API non configurées');
            }

            const token = this.generateToken();
            const expire = this.getExpireTimestamp();
            const signature = this.generateSignature(token, expire);

            await addDoc(collection(this.db, 'imagekit_auths'), {
                token,
                expire,
                createdAt: serverTimestamp(),
                deviceInfo: {
                    platform: Platform.OS,
                    version: Platform.Version
                }
            });

            return { token, expire, signature };
        } catch (error) {
            console.error('Erreur génération auth:', error);
            throw new Error('Échec de l\'authentification ImageKit');
        }
    }
}

export const imagekitAuth = new ImageKitAuth();