import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

// Middleware pour vérifier que l'utilisateur peut gérer les catégories
export const requireCategoryPermission = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Supposons que req.user contient l'utilisateur authentifié
  const user = (req as any).user as User;

  if (!user) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  // Seuls les GESTIONNAIRE peuvent créer/modifier/supprimer des catégories
  if (user.role !== "GESTIONNAIRE") {
    return res.status(403).json({
      error: "Seuls les gestionnaires peuvent gérer les catégories",
    });
  }

  next();
};

// Middleware pour vérifier l'accès en lecture aux catégories
export const requireCategoryReadAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as User;

  if (!user) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  // Tous les utilisateurs authentifiés peuvent lire les catégories
  // mais on peut ajouter des restrictions supplémentaires ici si nécessaire
  next();
};
