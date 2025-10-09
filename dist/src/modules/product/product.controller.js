// Product.controller.ts
import { ProductStatus } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import { ProductMessages, ProductValidationRules } from "./product.enum.js";
import { z } from "zod";
const ProductBaseSchema = {
    title: z
        .string()
        .min(ProductValidationRules.MIN_TITLE_LENGTH, ProductMessages.TITLE_REQUIRED),
    description: z.string().nullable().optional(),
    price: z.number().positive(ProductMessages.INVALID_PRICE),
    imageUrl: z.string().url().nullable().optional(),
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
            const data = this.createSchema?.parse(req.body) ?? req.body;
            const entity = await this.service.create(data);
            res
                .status(201)
                .json({ message: ProductMessages.CREATION_SUCCESS, entity });
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
            let entities = await this.service.findAll({ skip, take: limit, search });
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
            const entity = await this.service.findById(id);
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
