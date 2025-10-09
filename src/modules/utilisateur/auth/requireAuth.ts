import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_ALGO = "HS512";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.replace("Bearer ", "");
  if (!token && req.cookies) {
    token = req.cookies.accessToken;
  }
  if (!token) return res.status(401).json({ error: "Token manquant" });
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGO],
    });
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
