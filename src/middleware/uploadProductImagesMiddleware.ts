import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";

// À configurer dans un fichier .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware pour vérifier et uploader les images sur Cloudinary
export async function uploadProductImagesMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Multer peut stocker les fichiers dans req.files ou req.file selon la config
    let files: Express.Multer.File[] = [];
    if (Array.isArray(req.files)) {
      files = req.files as Express.Multer.File[];
    } else if (req.files && typeof req.files === "object") {
      // Cas où Multer utilise un objet (ex: upload.fields)
      files = Object.values(req.files).flat();
    } else if (req.file) {
      files = [req.file as Express.Multer.File];
    }

    if (!files || files.length === 0) {
      console.error(
        "Aucune image reçue. req.files:",
        req.files,
        "req.file:",
        req.file
      );
      return res
        .status(400)
        .json({
          message: "Aucune image reçue.",
          files: req.files,
          file: req.file,
        });
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        imageUrls.push(result.secure_url);
      } catch (err) {
        console.error("Erreur Cloudinary:", err);
        return res
          .status(500)
          .json({ message: "Erreur Cloudinary", error: err });
      }
    }

    req.body.imageUrls = imageUrls;
    next();
  } catch (error) {
    console.error("Erreur uploadProductImagesMiddleware:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l’upload des images.", error });
  }
}
