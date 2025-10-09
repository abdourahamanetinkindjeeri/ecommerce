// src/modules/abstract/abstract.enum.ts

export enum BaseMessages {
  // Messages génériques de succès
  CREATION_SUCCESS = "Création réussie",
  UPDATE_SUCCESS = "Mise à jour réussie",
  DELETE_SUCCESS = "Suppression réussie",
  LIST_SUCCESS = "Liste récupérée avec succès",
  DETAIL_SUCCESS = "Élément récupéré avec succès",
  OPERATION_SUCCESS = "Opération réussie",

  // Messages génériques d'erreur
  NOT_FOUND = "Élément non trouvé",
  UNAUTHORIZED = "Accès non autorisé",
  FORBIDDEN = "Action interdite",
  INVALID_REQUEST = "Requête invalide",
  VALIDATION_ERROR = "Erreur de validation",
  INTERNAL_ERROR = "Erreur interne du serveur",
  NETWORK_ERROR = "Erreur de réseau",
  TIMEOUT_ERROR = "Délai d'attente dépassé",

  // Messages de validation génériques
  REQUIRED_FIELD = "Ce champ est obligatoire",
  INVALID_FORMAT = "Format invalide",
  INVALID_TYPE = "Type de données invalide",
  TOO_SHORT = "Valeur trop courte",
  TOO_LONG = "Valeur trop longue",
  INVALID_EMAIL = "Format d'email invalide",
  INVALID_URL = "Format d'URL invalide",
  INVALID_DATE = "Format de date invalide",
  INVALID_NUMBER = "Nombre invalide",

  // Messages d'authentification
  LOGIN_REQUIRED = "Connexion requise",
  INVALID_TOKEN = "Token invalide",
  TOKEN_EXPIRED = "Token expiré",
  INSUFFICIENT_PRIVILEGES = "Privilèges insuffisants",

  // Messages de pagination
  INVALID_PAGE = "Numéro de page invalide",
  INVALID_LIMIT = "Limite invalide",
  PAGE_OUT_OF_RANGE = "Page hors limites",
}

export enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ValidationRules {
  MIN_STRING_LENGTH = 1,
  MAX_STRING_LENGTH = 255,
  MIN_TEXT_LENGTH = 1,
  MAX_TEXT_LENGTH = 1000,
  MIN_PASSWORD_LENGTH = 8,
  MAX_PASSWORD_LENGTH = 128,
  MIN_PAGE = 1,
  MAX_LIMIT = 100,
  DEFAULT_LIMIT = 10,
}
