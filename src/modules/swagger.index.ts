// src/modules/swagger.index.ts

/**
 * Index central pour tous les schémas Swagger des modules
 * Ce fichier contient la configuration principale de la documentation Swagger
 *
 * Les schémas individuels sont définis dans:
 * - ./utilisateur/swagger.utilisateur.schema.ts
 * - ./product/swagger.product.schema.ts
 * - ./category/swagger.category.schema.ts
 * - ./authentication/swagger.auth.schema.ts
 * - ./auditlog/swagger.auditlog.schema.ts
 */

/**
 * @swagger
 * info:
 *   title: eCommerce API
 *   version: 1.0.0
 *   description: |
 *     API complète pour la plateforme eCommerce
 *
 *     ## Modules disponibles:
 *     - **Users**: Gestion des utilisateurs et profils
 *     - **Products**: Gestion des produits et catalogue
 *     - **Categories**: Organisation des produits par catégories
 *     - **Authentication**: Authentification et autorisation
 *     - **Audit Logs**: Traçabilité et logs d'audit
 *
 *     ## Authentification
 *     Cette API utilise deux méthodes d'authentification:
 *     - **Bearer Token**: Token JWT dans l'en-tête Authorization
 *     - **Cookie Auth**: Cookie HTTP sécurisé (recommandé pour les applications web)
 *
 *     ## Codes de statut
 *     - `200` - Succès
 *     - `201` - Ressource créée
 *     - `204` - Succès sans contenu
 *     - `400` - Données invalides
 *     - `401` - Non authentifié
 *     - `403` - Accès refusé
 *     - `404` - Ressource non trouvée
 *     - `409` - Conflit (ressource déjà existante)
 *     - `500` - Erreur serveur
 *   contact:
 *     name: Support API eCommerce
 *     email: support@ecommerce.com
 *   license:
 *     name: MIT
 *     url: https://opensource.org/licenses/MIT
 *
 * servers:
 *   - url: http://localhost:3000
 *     description: Serveur de développement
 *   - url: https://api.ecommerce.com
 *     description: Serveur de production
 *
 * tags:
 *   - name: Users
 *     description: Gestion des utilisateurs
 *   - name: Products
 *     description: Gestion des produits
 *   - name: Categories
 *     description: Gestion des catégories
 *   - name: Authentication
 *     description: Authentification et autorisation
 *   - name: Audit Logs
 *     description: Logs d'audit et traçabilité
 */

export {};
