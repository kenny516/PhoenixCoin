<div align="center">
  <img src="./assets/images/logo.png" alt="Phoenix Coin Logo" width="120"/>
  
  # Phoenix Coin
  
  🚀 Une application mobile de trading de cryptomonnaies moderne et sécurisée

  [![Expo](https://img.shields.io/badge/Expo-52.0.28-blue.svg)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React%20Native-0.76.6-blue.svg)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org)
</div>

## 📱 Aperçu

Phoenix Coin est une plateforme mobile de trading de cryptomonnaies qui offre une expérience utilisateur fluide et sécurisée. L'application permet aux utilisateurs de gérer leurs portefeuilles, suivre les cours en temps réel et effectuer des transactions en toute sécurité.

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée avec Firebase
- 📊 Suivi des cours en temps réel
- 💱 Trading de cryptomonnaies
- 📈 Graphiques interactifs avec react-native-gifted-charts
- 🌓 Thème clair/sombre automatique
- 📱 Interface utilisateur réactive et moderne avec NativeWind

## 🛠️ Technologies Utilisées

- **Frontend**
  - React Native
  - Expo Router
  - TypeScript
  - NativeWind (Tailwind CSS)
  - React Native Reanimated

- **Backend & Services**
  - Firebase Authentication
  - Firebase Firestore
  - Expo Notifications
  - ImageKit pour la gestion des images

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone [votre-repo-url]
   cd phoenix-coin
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Remplissez les variables d'environnement nécessaires dans le fichier `.env`

4. **Lancer l'application**
   ```bash
   npm start
   ```

## 📱 Scripts Disponibles

- `npm start` - Lance le serveur de développement Expo
- `npm run android` - Lance l'application sur Android
- `npm run ios` - Lance l'application sur iOS
- `npm run web` - Lance l'application en version web
- `npm run test` - Lance les tests
- `npm run lint` - Vérifie le code avec le linter

## 🏗️ Structure du Projet

```
phoenix-coin/
├── app/                    # Routes et pages de l'application
│   ├── (tabs)/            # Navigation par onglets
│   ├── auth/              # Pages d'authentification
│   └── content/           # Contenu principal
├── assets/                # Images et ressources statiques
├── components/            # Composants réutilisables
├── firebase/             # Configuration Firebase
├── hooks/                # Custom hooks
├── stores/               # État global (Zustand)
└── types/                # Définitions TypeScript
```

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.
