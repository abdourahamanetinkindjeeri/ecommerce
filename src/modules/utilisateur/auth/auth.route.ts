// import { Router, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";
// import { validateUser } from "./validateUser.js";
// import { clearRefreshTokenCookie, setRefreshTokenCookie } from "./cookies.js";

// const prisma = new PrismaClient();
// const router = Router();

// // === CONFIGURATION JWT ===
// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";
// const JWT_ALGO: jwt.Algorithm = "HS256";
// const ACCESS_TOKEN_EXPIRES = "15m";
// const REFRESH_TOKEN_EXPIRES = "7d";

// type TokenType = "access" | "refresh";

// // === GÉNÉRATION DES TOKENS ===
// function generateToken(payload: object, type: TokenType): string {
//   const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
//   const expiresIn =
//     type === "access" ? ACCESS_TOKEN_EXPIRES : REFRESH_TOKEN_EXPIRES;

//   return jwt.sign(payload, secret, {
//     algorithm: JWT_ALGO,
//     expiresIn,
//   });
// }

// // === EXTRACTION DU PAYLOAD DU REFRESH TOKEN ===
// function extractPayloadFromRefreshToken(token: string) {
//   try {
//     const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
//       algorithms: [JWT_ALGO],
//     }) as jwt.JwtPayload;
//     return { email: payload.email as string };
//   } catch {
//     return null;
//   }
// }

// // === LOGIN ===
// router.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { login, password } = req.body;
//     if (!login)
//       return res.status(400).json({ error: "Login requis" });
//     else if (!password)
//       return res.status(400).json({ error: "Mot de passe requis" });

//     const user = await validateUser(login, password);
//     if (!user) return res.status(401).json({ error: "Identifiants invalides" });

//     const accessPayload = {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     };

//     const refreshPayload = { email: user.email };

//     const accessToken = generateToken(accessPayload, "access");
//     const refreshToken = generateToken(refreshPayload, "refresh");

//     // === SET COOKIES SECURE ===
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 15 * 60 * 1000, // 15 minutes
//     });

//     setRefreshTokenCookie(res, refreshToken); // cookie httpOnly pour le refresh token

//     // === RÉPONSE JSON (SANS TOKEN) ===
//     return res.json({
//       message: "Connexion réussie",
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur lors du login :", error);
//     return res.status(500).json({ error: "Erreur serveur" });
//   }
// });

// // === RAFRAÎCHIR LE TOKEN D’ACCÈS ===
// router.post("/refresh", async (req: Request, res: Response) => {
//   const token = req.cookies?.refreshToken;
//   if (!token) return res.status(401).json({ error: "Token manquant" });

//   const payload = extractPayloadFromRefreshToken(token);
//   if (!payload?.email) return res.status(401).json({ error: "Token invalide" });

//   try {
//     const user = await prisma.user.findUnique({
//       where: { email: payload.email },
//     });
//     if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

//     const accessPayload = {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     };

//     const accessToken = generateToken(accessPayload, "access");

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 15 * 60 * 1000,
//     });

//     return res.json({ message: "Token rafraîchi" });
//   } catch (error) {
//     console.error("Erreur lors du refresh :", error);
//     return res.status(500).json({ error: "Erreur serveur" });
//   }
// });

// // === LOGOUT ===
// router.post("/logout", (req: Request, res: Response) => {
//   clearRefreshTokenCookie(res);
//   res.clearCookie("accessToken");
//   return res.json({ message: "Déconnexion réussie" });
// });

// export default router;

import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "./cookies.js";

const prisma = new PrismaClient();
const router = Router();

// === CONFIGURATION JWT ===
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";
const JWT_ALGO: jwt.Algorithm = "HS256";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

type TokenType = "access" | "refresh";

// === GÉNÉRATION DES TOKENS ===
function generateToken(payload: object, type: TokenType): string {
  const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
  const expiresIn =
    type === "access" ? ACCESS_TOKEN_EXPIRES : REFRESH_TOKEN_EXPIRES;

  return jwt.sign(payload, secret, { algorithm: JWT_ALGO, expiresIn });
}

// === EXTRACTION DU PAYLOAD DU REFRESH TOKEN ===
function extractPayloadFromRefreshToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: [JWT_ALGO],
    }) as jwt.JwtPayload;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

// === LOGIN ===
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    // ✅ Validation côté serveur
    const errors: Record<string, string> = {};
    if (!login || login.trim() === "") errors.login = "L'email est requis.";
    if (!password || password.trim() === "")
      errors.password = "Le mot de passe est requis.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // ✅ Recherche de l'utilisateur
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { name: login }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errors: { login: "Utilisateur introuvable." } });
    }

    // ✅ Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ errors: { password: "Mot de passe incorrect." } });
    }

    // ✅ Génération des tokens
    const accessPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload = { email: user.email };

    const accessToken = generateToken(accessPayload, "access");
    const refreshToken = generateToken(refreshPayload, "refresh");

    // ✅ Cookies sécurisés
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    setRefreshTokenCookie(res, refreshToken);

    // ✅ Réponse succès
    return res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors du login :", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// === REFRESH TOKEN ===
router.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token)
    return res.status(401).json({ error: "Token d’actualisation manquant." });

  const payload = extractPayloadFromRefreshToken(token);
  if (!payload?.email)
    return res.status(401).json({ error: "Token invalide ou expiré." });

  try {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user)
      return res.status(404).json({ error: "Utilisateur non trouvé." });

    const newAccessToken = generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "access"
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Token d’accès rafraîchi avec succès." });
  } catch (error) {
    console.error("Erreur lors du refresh :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

// === GET CURRENT USER (ME) ===
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Token d'accès manquant." });
    }

    const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGO] }) as jwt.JwtPayload;
    if (!payload.id) {
      return res.status(401).json({ error: "Token invalide." });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        telephone: true,
        adresse: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    return res.json({
      message: "Utilisateur récupéré avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Token invalide ou expiré." });
    }
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

// === LOGOUT ===
router.post("/logout", (req: Request, res: Response) => {
  clearRefreshTokenCookie(res);
  res.clearCookie("accessToken");
  return res.json({ message: "Déconnexion réussie" });
});

export default router;
