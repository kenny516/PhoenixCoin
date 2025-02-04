import "dotenv/config";

export default {
    expo: {
        extra: {
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.FIREBASE_APP_ID,
            firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,

            imageKitPublicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
            imageKitPrivateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
            imageKitUrlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
        },
    },
};
