// utils/imagekit-auth.ts
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

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
        this.privateKey = 'votre_private_key_imagekit'; // À stocker de manière sécurisée
        this.publicKey = 'votre_public_key_imagekit';
        this.db = getFirestore();
    }

    private getExpireTimestamp(): number {
        // Expire dans 30 minutes
        return Math.floor(Date.now() / 1000) + (30 * 60);
    }

    private generateToken(): string {
        return CryptoJS.lib.WordArray.random(16).toString();
    }

    private generateSignature(token: string, expire: number): string {
        const signatureString = token + expire.toString();
        return CryptoJS.HmacSHA1(signatureString, this.privateKey).toString();
    }

    public async getAuthenticationParameters(): Promise<AuthParams> {
        try {
            const token = this.generateToken();
            const expire = this.getExpireTimestamp();
            const signature = this.generateSignature(token, expire);

            // Enregistrer l'authentification dans Firestore pour audit
            await addDoc(collection(this.db, 'imagekit_auths'), {
                token,
                expire,
                createdAt: serverTimestamp(),
                deviceInfo: {
                    platform: Platform.OS,
                    version: Platform.Version
                }
            });

            return {
                token,
                expire,
                signature
            };
        } catch (error) {
            console.error('Erreur génération auth:', error);
            throw error;
        }
    }
}

export const imagekitAuth = new ImageKitAuth();