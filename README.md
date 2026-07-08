# 🚚 DeliverMa — Plateforme de gestion de livraison de colis

DeliverMa est une application web fullstack de gestion de livraison de colis au Maroc, développée dans le cadre d'un stage de fin d'études. Elle centralise les interactions entre **clients**, **vendeurs**, **livreurs** et **administrateurs**, et couvre l'intégralité du cycle de vie d'une commande.

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Structure du projet](#structure-du-projet)
- [API REST](#api-rest)
- [Modèle de données](#modèle-de-données)
- [Sécurité](#sécurité)

---

## Aperçu

| Espace | Acteur | Accès |
|---|---|---|
| Public | Visiteur | Catalogue, suivi de commande |
| Client | Client authentifié | Panier, commandes, adresses, fidélité |
| Vendeur | Vendeur authentifié | Boutique, offres, stock, commandes |
| Livreur | Livreur (créé par admin) | Tournée, profil, zones |
| Admin | Administrateur | Supervision complète de la plateforme |

---

## Fonctionnalités

### 🔐 Authentification
- Inscription Client / Vendeur avec sélection de rôle
- Connexion avec JWT signé RSA, stocké en cookie HTTP-Only
- Gestion multi-rôles — un compte peut cumuler Client et Vendeur
- Switch de rôle sans déconnexion
- Réinitialisation du mot de passe par email
- Création de comptes livreurs par l'admin avec lien d'invitation

### 🛍️ Catalogue public
- Navigation sans authentification
- Filtres par catégorie et recherche par nom
- Détail produit avec liste des offres des vendeurs
- Suivi de commande public par numéro

### 👤 Espace Client
- Panier persisté en localStorage (gestion tracable/non tracable)
- Checkout avec sélection d'adresse et calcul automatique des frais
- Utilisation des points de fidélité (0.5 MAD / point)
- Historique des commandes avec timeline de statut
- Annulation de commande (statut CONFIRMEE uniquement)
- Gestion des adresses de livraison

### 🏪 Espace Vendeur
- Tableau de bord avec KPIs (CA, commandes, stock)
- Gestion des offres sur le catalogue
- Mode tracé — suivi par numéro de série (génération automatique)
- Remise en vente des unités retournées
- Gestion des commandes (CONFIRMEE → EN_PREPARATION → EXPEDIEE)

### 🚴 Espace Livreur
- Vue tournée (commandes EXPEDIEE et EN_TRANSIT)
- Prise en charge, confirmation et signalement d'échec
- Gestion du profil et des zones de livraison

### ⚙️ Espace Administrateur
- Tableau de bord global (utilisateurs, commandes, CA)
- Gestion des zones de livraison, catégories, produits
- Supervision et intervention sur toutes les commandes
- Gestion des vendeurs, livreurs et utilisateurs
- Suspension / réactivation de comptes

### 📧 Notifications
- Email de confirmation de commande avec récapitulatif
- Email de mise à jour de statut
- Email d'annulation avec remboursement des points
- Email d'échec de livraison avec raison
- Bon de livraison PDF joint à l'email de livraison

---

## Architecture

```
┌─────────────────────────────────────────┐
│         React 18 + Vite (Frontend)       │
│   TanStack Query · React Router v6       │
│   Context API · SCSS Modulaire           │
└─────────────────┬───────────────────────┘
                  │ HTTP/JSON (REST API)
┌─────────────────▼───────────────────────┐
│       Spring Boot 3.x (Backend)          │
│  Spring Security · JWT RSA · JPA/Hiber. │
│  Spring Mail · iText7 · Async           │
└─────────────────┬───────────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────────┐
│            MySQL 8 (16 tables)           │
└─────────────────────────────────────────┘
```

### Cycle de vie d'une commande

```
Client passe commande
       ↓
  EN_ATTENTE  →  CONFIRMEE  (automatique)
       ↓
  EN_PREPARATION  (Vendeur)
       ↓
  EXPEDIEE  →  Livreur assigné automatiquement
       ↓
  EN_TRANSIT  (Livreur)
       ↓
  LIVREE  →  Points crédités + PDF envoyé
  ou
  ECHEC   →  Stock réintégré
```

---

## Stack technique

### Backend
| Technologie | Version | Usage |
|---|---|---|
| Java | 21 (LTS) | Langage principal |
| Spring Boot | 3.x | Framework backend |
| Spring Security | 6.x | Authentification & autorisation |
| Spring Data JPA | 3.x | Persistance |
| Hibernate | 6.x | ORM |
| JWT (JJWT) | 0.12.x | Tokens d'authentification |
| iText7 | 7.2.5 | Génération PDF |
| Lombok | 1.18.x | Réduction du code boilerplate |
| Maven | 3.x | Gestion des dépendances |
| SpringDoc OpenAPI | 2.x | Documentation Swagger |

### Frontend
| Technologie | Version | Usage |
|---|---|---|
| React | 18 | UI |
| Vite | 5.x | Build tool |
| React Router | v6 | Navigation SPA |
| TanStack Query | v5 | État serveur & cache |
| SCSS | — | Styles modulaires |
| React Icons | 4.x | Icônes vectorielles |

### Base de données & Services
| Service | Usage |
|---|---|
| MySQL 8 | Base de données principale |
| Cloudinary | Hébergement des images |
| Gmail SMTP | Envoi des emails transactionnels |

---

## Prérequis

- **Java 21+**
- **Node.js 18+** et **npm**
- **MySQL 8+**
- **Maven 3.8+**
- Compte **Cloudinary** (gratuit)
- Compte **Gmail** avec mot de passe d'application activé

---

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/bildev345/delivery-web-app.git
cd 'delivery web app'
```

### 2. Base de données

```sql
CREATE DATABASE deliverma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'deliverma_user'@'localhost' IDENTIFIED BY 'votre_password';
GRANT ALL PRIVILEGES ON deliverma.* TO 'deliverma_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Clés RSA (Backend)

```bash
# Générer la paire de clés RSA
cd api/src/main/resources/keys
générer la clé privée:
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

extraire la clé publique en utilisant la clé privée:
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

### 4. Backend

```bash
cd api

# Configurer les variables d'environnement
# puis lancer :
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`
La documentation Swagger sur `http://localhost:8080/swagger-ui.html`

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Structure du projet

### Backend

```
api/
└── src/main/java/com/deliverma/api/
    ├── auth/                   # Authentification, JWT, reset password
    │   ├── AuthController.java
    │   ├── AuthService.java
    │   ├── dto/
    │   └── service/PasswordResetService.java
    ├── client/                 # Espace client
    │   ├── controller/         # AdresseController, CommandeController
    │   ├── service/            # AdresseService, CommandeService, FideliteService
    │   └── repository/
    ├── vendeur/                # Espace vendeur
    │   ├── controller/         # OffreController, CommandeVendeurController
    │   ├── service/            # OffreService, StockService, StatutService
    │   └── repository/
    ├── livreur/                # Espace livreur
    │   ├── LivreurController.java
    │   └── CommandeLivreurController.java
    ├── admin/                  # Espace administrateur
    │   └── controller/         # ZoneController, ProduitController...
    ├── shared/                 # Éléments partagés
    │   ├── entities/           # Entités JPA (User, Commande, Offre...)
    │   ├── repositories/       # Repositories partagés
    │   ├── dto/                # DTOs partagés
    │   ├── enums/              # StatutCommande, Role, UniteStatut...
    │   ├── exception/          # Exceptions métier + GlobalExceptionHandler
    │   └── service/            # EmailService, PDFService
    ├── security/               # Configuration Spring Security
    │   ├── JwtService.java
    │   ├── JwtAuthenticationFilter.java
    │   └── SecurityConfig.java
    └── validation/             # StatutTransitionValidator
```

### Frontend

```
frontend/src/
├── api/                # Fonctions d'appel API par domaine
│   ├── fetchInstance.js
│   ├── authApi.js
│   ├── commandeApi.js
│   └── ...
├── context/            # Contextes React globaux
│   ├── AuthContext.js
│   ├── AuthProvider.jsx
│   └── PanierProvider.jsx
├── hooks/              # Hooks personnalisés
│   ├── useAuth.js
│   ├── usePanier.js
│   ├── useCommandes.js
│   └── ...
├── layouts/            # Layouts par espace
│   ├── PublicLayout.jsx
│   ├── client/ClientLayout.jsx
│   ├── vendeur/VendeurLayout.jsx
│   ├── livreur/LivreurLayout.jsx
│   └── admin/AdminLayout.jsx
├── pages/              # Pages par acteur
│   ├── auth/
│   ├── catalogue/
│   ├── client/
│   ├── vendeur/
│   ├── livreur/
│   └── admin/
├── components/         # Composants réutilisables
│   └── shared/
└── styles/             # SCSS modulaires
    ├── _variables.scss
    ├── _buttons.scss
    ├── _layout.scss
    └── ...
```

---

## API REST

### Endpoints publics

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/auth/valider-token` | Valider un token reset |
| POST | `/api/v1/auth/set-password` | Définir un mot de passe |
| GET | `/api/v1/catalogue/produits` | Liste du catalogue |
| GET | `/api/v1/catalogue/produits/{id}` | Détail produit |
| GET | `/api/v1/catalogue/produits/{id}/offres` | Offres d'un produit |
| GET | `/api/v1/commandes/suivi/{numero}` | Suivi public |

### Endpoints Client `[CLIENT]`

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/client/adresses` | Mes adresses |
| POST | `/api/v1/client/adresses` | Ajouter une adresse |
| PUT | `/api/v1/client/adresses/{id}` | Modifier une adresse |
| DELETE | `/api/v1/client/adresses/{id}` | Supprimer une adresse |
| PATCH | `/api/v1/client/adresses/{id}/default` | Adresse par défaut |
| POST | `/api/v1/client/commandes` | Passer une commande |
| GET | `/api/v1/client/commandes` | Historique commandes |
| GET | `/api/v1/client/commandes/{id}` | Détail commande |
| POST | `/api/v1/client/commandes/{id}/annuler` | Annuler commande |

### Endpoints Vendeur `[VENDEUR]`

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/vendeur/offres` | Mes offres |
| POST | `/api/v1/vendeur/offres` | Créer une offre |
| PUT | `/api/v1/vendeur/offres/{id}` | Modifier une offre |
| PATCH | `/api/v1/vendeur/offres/{id}/toggle` | Activer/désactiver |
| GET | `/api/v1/vendeur/unites/{offreId}` | Unités d'une offre |
| POST | `/api/v1/vendeur/unites/generer` | Générer des unités |
| PATCH | `/api/v1/vendeur/unites/{id}/remettre-en-vente` | Remettre en vente |
| GET | `/api/v1/vendeur/commandes` | Commandes vendeur |
| PATCH | `/api/v1/vendeur/commandes/{id}/statut` | Changer statut |
| GET | `/api/v1/vendeur/dashboard` | Statistiques |

### Endpoints Livreur `[LIVREUR]`

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/livreur/commandes` | Ma tournée |
| PATCH | `/api/v1/livreur/commandes/{id}/statut` | Changer statut |
| GET | `/api/v1/livreur/profil` | Mon profil |
| PUT | `/api/v1/livreur/profil` | Modifier profil + zones |

### Endpoints Admin `[ADMIN]`

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/admin/dashboard` | Tableau de bord |
| GET/POST/PUT | `/api/v1/admin/zones` | Gestion zones |
| PATCH | `/api/v1/admin/zones/{id}/toggle` | Activer/désactiver |
| GET/POST/PUT | `/api/v1/admin/produits` | Gestion produits |
| GET/POST/PUT | `/api/v1/admin/categories` | Gestion catégories |
| GET | `/api/v1/admin/vendeurs` | Liste vendeurs |
| GET | `/api/v1/admin/livreurs` | Liste livreurs |
| POST | `/api/v1/admin/livreurs` | Créer un livreur |
| PATCH | `/api/v1/admin/livreurs/{id}/toggle` | Disponibilité |
| GET | `/api/v1/admin/commandes` | Toutes les commandes |
| PATCH | `/api/v1/admin/commandes/{id}/statut` | Changer statut |
| GET | `/api/v1/admin/utilisateurs` | Liste utilisateurs |
| PATCH | `/api/v1/admin/utilisateurs/{id}/toggle` | Suspendre/réactiver |

---

## Modèle de données

La base de données est composée de **18 tables** :

```
USERS · USER_ROLES · CLIENTS · VENDEURS · LIVREURS
LIVREUR_ZONES · ZONE_LIVRAISONS · CATEGORIES · PRODUITS
OFFRES · UNITE_PRODUITS · ADRESSE_CLIENTS · COMMANDES
LIGNE_COMMANDES · SUIVI_STATUTS · HISTORIQUE_POINTS
PASSWORD_RESET_TOKENS · AVIS
```

### Transitions de statut par rôle

```
CONFIRMEE      → CLIENT(ANNULEE) · VENDEUR(EN_PREPARATION, ANNULEE) · ADMIN(...)
EN_PREPARATION → VENDEUR(EXPEDIEE) · ADMIN(EXPEDIEE, ANNULEE)
EXPEDIEE       → LIVREUR(EN_TRANSIT) · ADMIN(EN_TRANSIT, ANNULEE)
EN_TRANSIT     → LIVREUR(LIVREE, ECHEC) · ADMIN(LIVREE, ECHEC)
```

---

## Sécurité

- **JWT asymétrique RSA** — clé privée pour signer, clé publique pour vérifier
- **Cookie HTTP-Only** — inaccessible depuis JavaScript (protection XSS)
- **STATELESS** — aucune session serveur, chaque requête est auto-suffisante
- **BCrypt** — hachage des mots de passe
- **CORS** configuré avec origines explicites et `credentials: true`
- **@PreAuthorize** — contrôle d'accès par rôle sur chaque endpoint
- **StatutTransitionValidator** — matrice de transitions autorisées par rôle
- **Verrou pessimiste JPA** — protection contre les race conditions sur le stock
- **Tokens de reset** — UUID unique + expiration 24h + usage unique

---

## Auteur

Développé par **Bilal** — Stage de fin d'études, Bachelor Génie Logicielle  
École Supérieure de Technologie de Fès — NewDev Maroc — 2025
