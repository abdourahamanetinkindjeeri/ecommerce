import { Router } from "express";
import multer from "multer";
import { uploadProductImagesMiddleware } from "../../middleware/uploadProductImagesMiddleware.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
export default function buildProductRoute(controller) {
    const router = Router();
    // Middleware de validation pour les prix (s'assurer qu'ils sont positifs)
    const validatePriceMiddleware = async (req, res, next) => {
        if (req.body && req.body.price) {
            const price = parseFloat(req.body.price);
            if (isNaN(price) || price <= 0) {
                return res
                    .status(400)
                    .json({ error: "Le prix doit être un nombre positif" });
            }
            req.body.price = price;
        }
        next();
    };
    // Multer configuration pour l'upload des images
    const upload = multer({ dest: "uploads/" });
    // Route de création de produit avec upload d'images et validation du prix
    router.post("/", requireAuth, requireRole('VENDEUR'), upload.array("images", 5), // max 5 images
    uploadProductImagesMiddleware, validatePriceMiddleware, controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/status/:status", controller.getByStatus.bind(controller));
    router.get("/user/:userId", requireAuth, controller.getByUser.bind(controller));
    router.get("/:id", controller.getOne.bind(controller));
    router.put("/:id", requireAuth, upload.array("images", 5), validatePriceMiddleware, controller.update.bind(controller));
    router.post("/:id/approve", requireAuth, requireRole('GESTIONNAIRE'), controller.approve.bind(controller));
    router.post("/:id/reject", requireAuth, requireRole('GESTIONNAIRE'), controller.reject.bind(controller));
    router.post("/:id/renew", requireAuth, requireRole('VENDEUR'), controller.renew.bind(controller));
    router.delete("/expired", requireAuth, requireRole('GESTIONNAIRE'), controller.deleteExpired.bind(controller));
    router.delete("/:id", requireAuth, controller.delete.bind(controller));
    return router;
}
