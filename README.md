# Architecture des Modules eCommerce

## Vue d'ensemble

Ce projet suit une architecture modulaire où chaque module contient sa propre logique métier, ses contrôleurs, routes et documentation Swagger.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli) : `npm install -g prisma`
- Une base de données compatible avec Prisma (PostgreSQL, MySQL, SQLite, etc.)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-depot>
   cd eCommerce
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   - Copiez le fichier `.env.example` vers `.env`
   - Remplissez les variables nécessaires (base de données, clés JWT, etc.)

4. Configurez Prisma :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Optionnel : Alimentez la base avec des données de test :
   ```bash
   npx prisma db seed
   ```

## Démarrage

Pour démarrer le serveur en mode développement :
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:5173`.

Pour la documentation Swagger, visitez `http://localhost:5173/api-docs`.

## Construction pour la production

```bash
npm run build
npm start
```

## Structure des Modules

Chaque module suit la structure suivante :
```
src/modules/[nom-module]/
├── swagger.[nom-module].schema.ts  # Documentation Swagger
├── [nom-module].controller.ts      # Contrôleurs et logique métier
├── [nom-module].route.ts          # Définition des routes
└── [nom-module].dto.ts            # Types et interfaces (optionnel)
```

## Modules Disponibles

### 1. **Utilisateur** (`/src/modules/utilisateur/`)
- **Modèle Prisma**: `User`
- **Routes**: `/api/users`
- **Fonctionnalités**: 
  - CRUD des utilisateurs
  - Gestion des rôles (VENDEUR, GESTIONNAIRE, VISITEUR)
- **Fichiers**:
  - `swagger.utilisateur.schema.ts` - Documentation Swagger
  - `utilisateur.controller.ts` - Contrôleurs
  - `utilisateur.route.ts` - Routes

### 2. **Produits** (`/src/modules/product/`)
- **Modèle Prisma**: `Product`
- **Routes**: `/api/products`
- **Fonctionnalités**:
  - CRUD des produits
  - Filtrage par statut, catégorie, utilisateur
  - Recherche par titre/description
  - Gestion des statuts (EN_ATTENTE, VALIDE, EXPIRE)
  - **Fonctionnalité VIP**: Les gestionnaires peuvent marquer les produits approuvés comme VIP
    - Route: `POST /api/products/:id/toggle-vip` (réservée aux GESTIONNAIRE)
    - Les produits VIP sont prioritaires dans les listes (tri par `isVip DESC`)
    - Affichage spécial avec icône ⭐ sur le frontend
- **Fichiers**:
  - `swagger.product.schema.ts` - Documentation Swagger
  - `product.controller.ts` - Contrôleurs avec interfaces
  - `product.route.ts` - Routes

### 3. **Catégories** (`/src/modules/category/`)
- **Modèle Prisma**: `Category`
- **Routes**: `/api/categories`
- **Fonctionnalités**:
  - CRUD des catégories
  - Recherche par libellé
  - Inclusion optionnelle des produits associés
  - Validation d'unicité du libellé
- **Fichiers**:
  - `swagger.category.schema.ts` - Documentation Swagger
  - `category.controller.ts` - Contrôleurs avec interfaces
  - `category.route.ts` - Routes

### 4. **Authentification** (`/src/modules/authentication/`)
- **Routes**: `/api/auth`
- **Fonctionnalités**:
  - Connexion/Déconnexion
  - Inscription
  - Réinitialisation de mot de passe
  - Vérification de token
  - Support JWT et cookies
- **Fichiers**:
  - `swagger.auth.schema.ts` - Documentation Swagger
  - `authMiddleware.ts` - Middleware d'authentification
  - `authRecovery.ts` - Récupération de mot de passe
  - `diagnosticAuth.ts` - Diagnostics d'authentification

### 5. **Audit Log** (`/src/modules/auditlog/`)
- **Routes**: `/api/audit-logs`
- **Fonctionnalités**:
  - Traçabilité des actions
  - Filtrage avancé des logs
  - Statistiques d'audit
  - Export CSV
  - Support des actions (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)
- **Fichiers**:
  - `swagger.auditlog.schema.ts` - Documentation Swagger

## Fichiers de Configuration Globaux

### `swagger.index.ts`
Fichier central contenant la configuration principale de Swagger avec :
- Informations générales de l'API
- Configuration des serveurs
- Tags globaux
- Documentation d'authentification

### `index.routes.ts`
Point d'entrée pour toutes les routes des modules. Centralise l'importation et la configuration des routes.

## Schéma Prisma Correspondant

Le projet utilise les modèles Prisma suivants :
- **User**: Utilisateurs avec rôles
- **Product**: Produits avec statuts et relations
- **Category**: Catégories avec libellé unique

## Authentification

L'API supporte deux méthodes d'authentification :
1. **Bearer Token**: Token JWT dans l'en-tête Authorization
2. **Cookie Auth**: Cookie HTTP sécurisé (recommandé pour les applications web)

## Codes de Statut Standards

- `200` - Succès
- `201` - Ressource créée
- `204` - Succès sans contenu
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `409` - Conflit (ressource déjà existante)
- `500` - Erreur serveur

## Utilisation

Pour intégrer ces modules dans votre application :

1. Importez les routes depuis `index.routes.ts`
2. Configurez Swagger en important `swagger.index.ts`
3. Assurez-vous que votre base de données Prisma est synchronisée avec le schéma
4. Configurez les middlewares d'authentification selon vos besoins

## Extensions Futures

L'architecture modulaire permet facilement d'ajouter de nouveaux modules en suivant la même structure :
- Commandes/Panier
- Paiements
- Notifications
- Gestion des fichiers/images
- Rapports et analytics