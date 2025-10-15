// Product.controller.ts
import { ProductStatus } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import { ProductMessages, ProductValidationRules } from "./product.enum.js";
import { z } from "zod";
import prisma from "../../prismaClient.js";
const ProductBaseSchema = {
    title: z
        .string()
        .min(ProductValidationRules.MIN_TITLE_LENGTH, ProductMessages.TITLE_REQUIRED),
    description: z.string().nullable().optional(),
    price: z.number().positive(ProductMessages.INVALID_PRICE),
    imageUrls: z
        .array(z.string().url())
        .min(1, "Au moins une image est requise."),
    status: z.nativeEnum(ProductStatus).optional(),
    dateExpiration: z.date().nullable().optional(),
    userId: z.string().uuid(ProductMessages.USER_REQUIRED),
    categoryId: z.string().uuid(ProductMessages.CATEGORY_REQUIRED),
    views: z.number().positive().optional(),
    isVip: z.boolean().optional(),
};
export class ProductController extends BaseController {
    service;
    createSchema = z.object(ProductBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(ProductBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
    // Surcharger les méthodes pour utiliser les messages personnalisés
    async create(req, res, next) {
        try {
            // On récupère les URLs d'images du middleware
            const imageUrls = req.body.imageUrls;
            if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
                res.status(400).json({ message: "Au moins une image est requise." });
                return;
            }
            // On prépare les données du produit sans imageUrls
            const { imageUrls: _, ...productData } = req.body;
            // Ajout du champ views si non défini
            if (typeof productData.views !== "number") {
                productData.views = 0;
            }
            // Création du produit
            const entity = await this.service.create(productData);
            // Création des images associées dans ProductImage
            const images = await Promise.all(imageUrls.map((url) => prisma.productImage.create({
                data: {
                    url,
                    productId: entity.id,
                },
            })));
            res
                .status(201)
                .json({ message: ProductMessages.CREATION_SUCCESS, entity, images });
            return;
        }
        catch (err) {
            next(err);
        }
    }
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search || undefined;
            const [entities, total] = await Promise.all([
                prisma.product.findMany({
                    skip,
                    take: limit,
                    where: {
                        AND: [
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                    orderBy: [
                        { isVip: 'desc' },
                        { createdAt: 'desc' }
                    ],
                    include: { images: true, category: true, user: true },
                }),
                prisma.product.count({
                    where: {
                        AND: [
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                })
            ]);
            res.status(200).json({
                page,
                limit,
                count: total,
                data: entities,
                message: ProductMessages.LIST_SUCCESS,
            });
        }
        catch (err) {
            next(err);
        }
    };
    getOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            // Incrémente le compteur de vues
            await prisma.product.update({
                where: { id },
                data: { views: { increment: 1 } },
            });
            // Récupération du produit avec ses images et le nombre de vues à jour
            const entity = await prisma.product.findUnique({
                where: { id },
                include: { images: true },
            });
            if (!entity)
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            res
                .status(200)
                .json({ data: entity, message: ProductMessages.DETAIL_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            // Handle image uploads if provided
            let imageUrls;
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                // Process uploaded images
                const fs = await import("fs/promises");
                const cloudinary = (await import("cloudinary")).v2;
                imageUrls = [];
                for (const file of req.files) {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: "products",
                        });
                        imageUrls.push(result.secure_url);
                        await fs.unlink(file.path);
                    }
                    catch (err) {
                        console.error("Erreur Cloudinary:", err);
                        await fs.unlink(file.path).catch(() => { });
                        return res.status(500).json({ message: "Erreur Cloudinary", error: err });
                    }
                }
            }
            const data = this.updateSchema?.parse(req.body) ?? req.body;
            // Empêche la mise à jour directe du compteur de vues via l'API (optionnel)
            if ("views" in data) {
                delete data.views;
            }
            // Handle image updates if new images provided
            if (imageUrls && imageUrls.length > 0) {
                // Delete existing images
                await prisma.productImage.deleteMany({
                    where: { productId: id }
                });
                // Create new images
                await Promise.all(imageUrls.map((url) => prisma.productImage.create({
                    data: {
                        url,
                        productId: id,
                    },
                })));
            }
            const entity = await this.service.update(id, data);
            if (!entity)
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            res
                .status(200)
                .json({ data: entity, message: ProductMessages.UPDATE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
    getByStatus = async (req, res, next) => {
        try {
            const { status } = req.params;
            if (!['VALIDE', 'EN_ATTENTE'].includes(status)) {
                return res.status(400).json({ error: 'Statut invalide. Utilisez VALIDE ou EN_ATTENTE.' });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search || undefined;
            const [entities, total] = await Promise.all([
                prisma.product.findMany({
                    skip,
                    take: limit,
                    where: {
                        AND: [
                            { status: status },
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                    orderBy: [
                        { isVip: 'desc' },
                        { createdAt: 'desc' }
                    ],
                    include: { images: true, category: true, user: true },
                }),
                prisma.product.count({
                    where: {
                        AND: [
                            { status: status },
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                })
            ]);
            res.status(200).json({
                page,
                limit,
                count: total,
                data: entities,
                message: `Produits ${status} récupérés avec succès`,
            });
        }
        catch (err) {
            next(err);
        }
    };
    approve = async (req, res, next) => {
        try {
            const { id } = req.params;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);
            const entity = await this.service.update(id, {
                status: 'VALIDE',
                dateExpiration: expirationDate
            });
            if (!entity)
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            res
                .status(200)
                .json({ data: entity, message: 'Produit approuvé avec succès' });
        }
        catch (err) {
            next(err);
        }
    };
    reject = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entity = await this.service.update(id, {
                status: 'REJETE'
            });
            if (!entity)
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            // Create notification for the seller
            await prisma.notification.create({
                data: {
                    message: `Votre produit "${entity.title}" a été rejeté par un gestionnaire.`,
                    type: 'REJECTION',
                    userId: entity.userId,
                    productId: entity.id,
                },
            });
            res
                .status(200)
                .json({ data: entity, message: 'Produit rejeté avec succès' });
        }
        catch (err) {
            next(err);
        }
    };
    renew = async (req, res, next) => {
        try {
            const { id } = req.params;
            // Vérifier que l'utilisateur est le propriétaire du produit
            const product = await prisma.product.findUnique({
                where: { id },
                include: { user: true }
            });
            if (!product) {
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            }
            // Vérifier si l'utilisateur connecté est le propriétaire
            // req.user est défini par le middleware d'authentification
            const userId = req.user?.id;
            if (product.userId !== userId) {
                return res.status(403).json({ error: ProductMessages.OWNER_ONLY });
            }
            if (product.dateExpiration && product.dateExpiration < new Date()) {
                return res.status(400).json({ error: ProductMessages.EXPIRED_PRODUCT });
            }
            // Prolonger de 7 jours
            const newExpirationDate = new Date(product.dateExpiration || new Date());
            newExpirationDate.setDate(newExpirationDate.getDate() + 7);
            const updatedProduct = await this.service.update(id, {
                dateExpiration: newExpirationDate
            });
            res.status(200).json({
                data: updatedProduct,
                message: 'Produit renouvelé avec succès'
            });
        }
        catch (err) {
            next(err);
        }
    };
    deleteExpired = async (req, res, next) => {
        try {
            const deleted = await prisma.product.deleteMany({
                where: {
                    dateExpiration: {
                        lt: new Date()
                    }
                }
            });
            res.status(200).json({
                message: `${deleted.count} produit(s) expiré(s) supprimé(s)`,
                count: deleted.count
            });
        }
        catch (err) {
            next(err);
        }
    };
    getByUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.id;
            const requestingUserRole = req.user?.role;
            // Check if the requesting user is the owner or has GESTIONNAIRE role
            if (requestingUserId !== userId && requestingUserRole !== 'GESTIONNAIRE') {
                return res.status(403).json({ error: 'Accès non autorisé. Vous ne pouvez voir que vos propres produits.' });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search || undefined;
            const [entities, total] = await Promise.all([
                prisma.product.findMany({
                    skip,
                    take: limit,
                    where: {
                        AND: [
                            { userId },
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                    orderBy: { createdAt: 'desc' },
                    include: { images: true, category: true, user: true },
                }),
                prisma.product.count({
                    where: {
                        AND: [
                            { userId },
                            search
                                ? { title: { contains: search, mode: "insensitive" } }
                                : {},
                            {
                                OR: [
                                    { dateExpiration: null },
                                    { dateExpiration: { gt: new Date() } }
                                ]
                            }
                        ]
                    },
                })
            ]);
            res.status(200).json({
                page,
                limit,
                count: total,
                data: entities,
                message: 'Produits de l\'utilisateur récupérés avec succès',
            });
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            res.status(204).json({ message: ProductMessages.DELETE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
    toggleVip = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: { id },
            });
            if (!product) {
                return res.status(404).json({ error: ProductMessages.NOT_FOUND });
            }
            const updatedProduct = await this.service.update(id, {
                isVip: !product.isVip
            });
            res.status(200).json({
                data: updatedProduct,
                message: `Produit ${updatedProduct.isVip ? 'marqué comme VIP' : 'retiré du VIP'} avec succès`
            });
        }
        catch (err) {
            next(err);
        }
    };
}
