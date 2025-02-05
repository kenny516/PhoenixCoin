// services/imagekitService.ts
import ImageKit from 'imagekit-javascript';
import { imagekitAuth } from '../utils/imagekit-auth';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

export class ImageKitService {
    private imagekit: ImageKit;

    constructor() {
        this.imagekit = new ImageKit({
            publicKey: Constants.expoConfig?.extra?.imageKitPublicKey || "",
            urlEndpoint: Constants.expoConfig?.extra?.imageKitUrlEndpoint || "",
        });
    }

    public async uploadImage(imageUri: string, fileName: string) {
        try {
            // Obtenir l'authentification localement
            const authParams = await imagekitAuth.getAuthenticationParameters();

            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const uploadOptions = {
                file: base64,
                fileName,
                signature: authParams.signature,
                token: authParams.token,
                expire: authParams.expire,
                useUniqueFileName: true,
                tags: ["react-native"],
                folder: "/uploads"
            };
            const result = await this.imagekit.upload(uploadOptions);
            // Enregistrer le résultat dans Firestore si nécessaire
            return {
                url: result.url,
                thumbnailUrl: result.thumbnailUrl,
                fileId: result.fileId
            };
        } catch (error) {
            console.error('Erreur upload:', error);
            throw error;
        }
    }
}

export default new ImageKitService();