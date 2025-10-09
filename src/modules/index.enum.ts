// src/modules/index.enum.ts

// Exports des enums de base et de l'application
export * from "./abstract/abstract.enum.js";
export * from "./app.enum.js";

// Exports des enums par module
export * from "./utilisateur/utilisateur.enum.js";
export * from "./product/product.enum.js";
export * from "./category/category.enum.js";

// Types d'union utiles
export type AllMessages =
  | typeof import("./abstract/abstract.enum.js").BaseMessages[keyof typeof import("./abstract/abstract.enum.js").BaseMessages]
  | typeof import("./utilisateur/utilisateur.enum.js").UserMessages[keyof typeof import("./utilisateur/utilisateur.enum.js").UserMessages]
  | typeof import("./product/product.enum.js").ProductMessages[keyof typeof import("./product/product.enum.js").ProductMessages]
  | typeof import("./category/category.enum.js").CategoryMessages[keyof typeof import("./category/category.enum.js").CategoryMessages]
  | typeof import("./app.enum.js").AppMessages[keyof typeof import("./app.enum.js").AppMessages];

// Helper type pour les codes de statut HTTP
export type HttpStatusCode =
  typeof import("./abstract/abstract.enum.js").HttpStatusCodes[keyof typeof import("./abstract/abstract.enum.js").HttpStatusCodes];

// Type pour les environnements
export type Environment =
  typeof import("./app.enum.js").AppEnvironments[keyof typeof import("./app.enum.js").AppEnvironments];
