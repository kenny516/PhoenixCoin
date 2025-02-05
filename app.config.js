import "dotenv/config";

export default {
    expo: {
        name: "phoenix-coin",
        slug: "phoenix-coin",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/logo.png",
        scheme: "phoenixcoin",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        updates: {
            url: "https://u.expo.dev/238b62bb-a67f-4735-bd3b-a534b1bdd8ca",
        },
        runtimeVersion: {
            policy: "appVersion",
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/logo.png",
                backgroundColor: "#FFFFFF"
            },
            buildType: "apk",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.andriantsirafychankenny.phoenixcoin"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        owner: "andriantsirafychankenny",
        extra: {
            eas: {
                projectId: "238b62bb-a67f-4735-bd3b-a534b1bdd8ca"
            },
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
        }
    }
};
