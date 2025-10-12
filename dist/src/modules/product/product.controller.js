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
            // Récupération des produits avec leurs images
            const entities = await prisma.product.findMany({
                skip,
                take: limit,
                where: search
                    ? { title: { contains: search, mode: "insensitive" } }
                    : undefined,
                include: { images: true },
            });
            res.status(200).json({
                page,
                limit,
                count: entities.length,
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
            // Récupération du produit avec ses images
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
            const data = this.updateSchema?.parse(req.body) ?? req.body;
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
}
