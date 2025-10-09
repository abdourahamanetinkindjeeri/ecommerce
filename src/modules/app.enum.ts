// src/modules/app.enum.ts

export enum AppMessages {
  // Messages généraux de l'application
  WELCOME = "Bienvenue sur l'API eCommerce",
  API_READY = "API prête et fonctionnelle",
  HEALTH_CHECK_SUCCESS = "Service en bonne santé",

  // Messages d'erreur globaux
  INTERNAL_ERROR = "Erreur interne du serveur",
  SERVICE_UNAVAILABLE = "Service temporairement indisponible",
  MAINTENANCE_MODE = "Service en maintenance",
  RATE_LIMIT_EXCEEDED = "Limite de requêtes dépassée",

  // Messages de connexion/déconnexion
  CONNECTION_SUCCESS = "Connexion établie avec succès",
  CONNECTION_FAILED = "Échec de la connexion",
  DISCONNECTION_SUCCESS = "Déconnexion réussie",

  // Messages de base de données
  DB_CONNECTION_SUCCESS = "Connexion à la base de données établie",
  DB_CONNECTION_FAILED = "Échec de la connexion à la base de données",
  DB_MIGRATION_SUCCESS = "Migration de la base de données réussie",
  DB_MIGRATION_FAILED = "Échec de la migration de la base de données",
}

export enum AppConfig {
  DEFAULT_PAGE_SIZE = 10,
  MAX_PAGE_SIZE = 100,
  DEFAULT_TIMEOUT = 30000,
  MAX_UPLOAD_SIZE = 10485760, // 10MB en bytes
  MIN_PASSWORD_LENGTH = 8,
  MAX_PASSWORD_LENGTH = 128,
  SESSION_TIMEOUT = 3600000, // 1 heure en ms
}

export enum AppEnvironments {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
  STAGING = "staging",
}

export enum ApiVersions {
  V1 = "v1",
  V2 = "v2",
}

export enum ContentTypes {
  JSON = "application/json",
  XML = "application/xml",
  TEXT = "text/plain",
  HTML = "text/html",
  PDF = "application/pdf",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
}

export enum CacheKeys {
  USER_SESSION = "user:session:",
  PRODUCT_LIST = "products:list:",
  CATEGORY_LIST = "categories:list:",
  USER_PERMISSIONS = "user:permissions:",
}
