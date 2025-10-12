import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadProductImagesMiddleware } from "../../middleware/uploadProductImagesMiddleware.js";
import { ProductController } from "./product.controller.js";

export default function buildProductRoute(controller: ProductController) {
  const router = Router();

  // Middleware de validation pour les prix (s'assurer qu'ils sont positifs)
  const validatePriceMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
  router.post(
    "/",
    upload.array("images", 10), // max 10 images
    uploadProductImagesMiddleware,
    validatePriceMiddleware,
    controller.create.bind(controller)
  );

  router.get("/", controller.getAll.bind(controller));
  router.get("/:id", controller.getOne.bind(controller));
  router.put(
    "/:id",
    validatePriceMiddleware,
    controller.update.bind(controller)
  );
  router.delete("/:id", controller.delete.bind(controller));
  return router;
}
