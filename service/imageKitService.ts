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
            // Lancer en parallèle l'obtention des paramètres d'authentification
            // et la lecture du fichier en base64
            const [authParams, base64Data] = await Promise.all([
                imagekitAuth.getAuthenticationParameters(),
                FileSystem.readAsStringAsync(imageUri, {
                    encoding: FileSystem.EncodingType.Base64,
                }),
            ]);

            // Construire le Data URL en précisant le type MIME (ici image/jpeg)
            const fileBase64 = `data:image/jpeg;base64,${base64Data}`;

            const uploadOptions = {
                file: fileBase64,
                fileName,
                signature: authParams.signature,
                token: authParams.token,
                expire: authParams.expire,
                useUniqueFileName: true,
                tags: ["react-native"],
                folder: "/uploads"
            };

            const result = await this.imagekit.upload(uploadOptions);

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