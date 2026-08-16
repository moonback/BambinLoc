# 🗺️ Roadmap - BambinLoc

Ce document détaille les phases de développement de la marketplace BambinLoc, du MVP jusqu'aux fonctionnalités avancées et à la monétisation.

## ✅ Phase 1 : Fondation et MVP Base (Actuelle)
- [x] Initialisation de l'architecture (React, Node.js, Vite).
- [x] Configuration de la base de données (PostgreSQL, Drizzle ORM).
- [x] Mise en place de l'authentification (Firebase Auth).
- [x] Design System avec Tailwind CSS et Shadcn/ui.
- [x] Intégration de la page d'accueil (Hero, catégories, annonces populaires).
- [x] Page de recherche avec filtres de base.
- [x] Page détaillée d'une annonce (Informations, galerie, calcul du prix).
- [x] Tunnel de création d'annonce (Wizard en 3 étapes).
- [x] Dashboard Propriétaire (Aperçu des revenus, réservations, annonces).
- [x] Script de Seeding (données de test).

## 🚧 Phase 2 : Coeur de la Marketplace (Réservations & Paiements)
- [ ] **Système de Réservation**
  - Calendrier interactif avec gestion des dates indisponibles.
  - Workflow de validation (Demande de réservation -> Acceptation/Refus par le propriétaire).
- [ ] **Intégration Stripe**
  - Paiement par carte bancaire.
  - Gestion des cautions (empreinte bancaire).
  - Calcul dynamique et prélèvement de la commission plateforme.
  - Payouts (versements vers les propriétaires).
- [ ] **Dashboard Locataire**
  - Suivi des réservations passées et à venir.
  - Gestion des favoris.

## 💬 Phase 3 : Messagerie & Confiance
- [ ] **Messagerie Interne**
  - Discussion en temps réel entre propriétaire et locataire.
  - Notifications de nouveaux messages.
- [ ] **Système d'Avis**
  - Laisser un avis croisé après une location.
  - Calcul automatique de la note moyenne des propriétaires et du matériel.
- [ ] **Profils Publics**
  - Page `/utilisateur/:id` affichant la fiabilité, la note et les annonces de l'utilisateur.

## 🛡️ Phase 4 : Administration & Modération
- [ ] **Back-office Administrateur**
  - Vue d'ensemble des métriques de la plateforme (revenus, litiges).
  - Gestion des utilisateurs (suspension, suppression).
  - Modération des annonces et des avis.
  - Configuration dynamique des catégories et des frais de plateforme.
- [ ] **Gestion des litiges & Signalements**
  - Flux pour signaler un problème lors de la restitution.

## 📍 Phase 5 : Fonctionnalités Avancées & Mobile
- [ ] **Géolocalisation & Cartographie**
  - Affichage des annonces sur une carte interactive (Mapbox / Google Maps).
  - Recherche par rayon kilométrique.
- [ ] **Notifications PUSH et Emails**
  - Emails transactionnels (confirmation de réservation, rappels de restitution) via Resend.
- [ ] **PWA & Mobile**
  - Optimisation PWA (Progressive Web App) pour installation mobile.
  - Navigation bottom bar spécifique sur mobile.

## 🤖 Phase 6 : Intelligence Artificielle (Futures évolutions)
- [ ] **Aide à la création d'annonce (IA)**
  - Reconnaissance automatique du matériel depuis une photo.
  - Génération de descriptions optimisées pour le SEO.
- [ ] **Recommandations Intelligentes**
  - Suggestion de matériel complémentaire selon l'âge de l'enfant et la destination.
