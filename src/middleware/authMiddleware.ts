import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Token d'accès manquant." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

export const requireRole = (role: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as any).role !== role) {
    return res.status(403).json({ error: "Rôle requis non satisfait." });
  }
  next();
};
