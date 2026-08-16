# BambinLoc - Marketplace de location de matériel bébé et enfant

BambinLoc est une plateforme moderne permettant à des particuliers de louer du matériel pour bébés et enfants à d'autres particuliers. Pensée comme un "Airbnb du matériel de puériculture", l'application permet de rentabiliser le matériel inutilisé et d'aider les familles en déplacement à trouver ce dont elles ont besoin, sans surconsommer.

## 🚀 Fonctionnalités Principales (MVP)

*   **Recherche et filtrage** : Trouvez du matériel par catégorie (poussettes, sièges auto, lits bébé...), localisation et prix.
*   **Système d'annonces** : Pages détaillées avec galerie photos, caractéristiques, prix et disponibilités.
*   **Espace Propriétaire** : Dashboard permettant de gérer ses annonces, suivre ses revenus et gérer ses réservations.
*   **Authentification** : Inscription et connexion sécurisées via Google (Firebase Auth).
*   **Design Responsive** : Interface mobile-first, rapide et accessible (Shadcn/ui & Tailwind CSS).

## 🛠️ Stack Technique

**Frontend**
*   [React 19](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS v4](https://tailwindcss.com/)
*   [Shadcn/ui](https://ui.shadcn.com/)
*   [React Router](https://reactrouter.com/)

**Backend & Base de données**
*   [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
*   [PostgreSQL](https://www.postgresql.org/) (hébergé sur Google Cloud SQL)
*   [Drizzle ORM](https://orm.drizzle.team/)
*   [Firebase Authentication](https://firebase.google.com/products/auth)

## 📋 Prérequis

*   Node.js (v22 recommandé)
*   Une base de données PostgreSQL
*   Un projet Firebase avec l'authentification Google activée

## ⚙️ Installation & Configuration

1. **Cloner le projet et installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement**
   Copiez le fichier d'exemple et remplissez vos identifiants :
   ```bash
   cp .env.example .env
   ```
   *Assurez-vous de définir les variables liées à votre base de données (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`) et à Firebase.*

3. **Base de données (Drizzle ORM)**
   
   Pousser le schéma dans la base de données :
   ```bash
   npm run db:push
   ```
   
   Générer des données de démonstration (Seed) :
   ```bash
   npx tsx src/db/seed.ts
   ```

## 🚀 Lancement de l'application

**Mode Développement (Frontend & Backend en simultané)**
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000` et l'API sur `http://localhost:3001`.

**Mode Production**
```bash
npm run build
npm run start
```

## 📁 Structure du Projet

```text
├── src/
│   ├── components/      # Composants réutilisables (ui, layout, etc.)
│   ├── context/         # Contextes React (ex: AuthContext)
│   ├── db/              # Configuration Drizzle, schémas et scripts de seed
│   ├── lib/             # Utilitaires et configuration (Firebase)
│   ├── pages/           # Pages de l'application (Home, Search, Dashboard...)
│   ├── App.tsx          # Point d'entrée de l'application React
│   └── main.tsx         # Point de montage DOM
├── server.ts            # Point d'entrée du serveur backend Express
├── drizzle/             # Fichiers de migration Drizzle générés
└── package.json         # Scripts et dépendances
```

## 🗺️ Roadmap

Consultez le fichier [ROADMAP.md](./ROADMAP.md) pour voir les prochaines étapes de développement.
