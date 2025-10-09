# Architecture des Modules eCommerce

## Vue d'ensemble

Ce projet suit une architecture modulaire où chaque module contient sa propre logique métier, ses contrôleurs, routes et documentation Swagger.

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