import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const requireAuth = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Token d'accès manquant." });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré." });
    }
};
export const requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ error: "Rôle requis non satisfait." });
    }
    next();
};
