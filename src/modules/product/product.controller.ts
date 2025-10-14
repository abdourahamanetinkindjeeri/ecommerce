// Product.controller.ts
import { Product, ProductStatus } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import PrismaService from "../abstract/PrismaService.js";
import { ProductMessages, ProductValidationRules } from "./product.enum.js";

import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prismaClient.js";
import { CreateProductDto, UpdateProductDto } from "./product.dto.js";

const ProductBaseSchema = {
  title: z
    .string()
    .min(
      ProductValidationRules.MIN_TITLE_LENGTH,
      ProductMessages.TITLE_REQUIRED
    ),
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
};

export class ProductController extends BaseController<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  protected service: PrismaService<Product, CreateProductDto, UpdateProductDto>;

  protected createSchema = z.object(ProductBaseSchema) as z.ZodType<
    Omit<CreateProductDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
    })
    .merge(
      z.object(ProductBaseSchema).partial()
    ) as z.ZodType<UpdateProductDto>;

  constructor(
    service: PrismaService<Product, CreateProductDto, UpdateProductDto>
  ) {
    super();
    this.service = service;
  }

  // Surcharger les méthodes pour utiliser les messages personnalisés
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // On récupère les URLs d'images du middleware
      const imageUrls: string[] = req.body.imageUrls;
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
      const images = await Promise.all(
        imageUrls.map((url) =>
          prisma.productImage.create({
            data: {
              url,
              productId: entity.id,
            },
          })
        )
      );
      res
        .status(201)
        .json({ message: ProductMessages.CREATION_SUCCESS, entity, images });
      return;
    } catch (err) {
      next(err);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || undefined;

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
            { user: { isVip: 'desc' } },
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
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data: UpdateProductDto =
        this.updateSchema?.parse(req.body) ?? req.body;
      // Empêche la mise à jour directe du compteur de vues via l'API (optionnel)
      if ("views" in data) {
        delete data.views;
      }
      const entity = await this.service.update(id, data);
      if (!entity)
        return res.status(404).json({ error: ProductMessages.NOT_FOUND });
      res
        .status(200)
        .json({ data: entity, message: ProductMessages.UPDATE_SUCCESS });
    } catch (err) {
      next(err);
    }
  };

  getByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.params;
      if (!['VALIDE', 'EN_ATTENTE'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide. Utilisez VALIDE ou EN_ATTENTE.' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || undefined;

      const [entities, total] = await Promise.all([
        prisma.product.findMany({
          skip,
          take: limit,
          where: {
            AND: [
              { status: status as ProductStatus },
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
            { user: { isVip: 'desc' } },
            { createdAt: 'desc' }
          ],
          include: { images: true, category: true, user: true },
        }),
        prisma.product.count({
          where: {
            AND: [
              { status: status as ProductStatus },
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
    } catch (err) {
      next(err);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  };

  renew = async (req: Request, res: Response, next: NextFunction) => {
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

      console.log(`userId : ${userId} et productId : ${product.userId}`)
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
    } catch (err) {
      next(err);
    }
  };

  deleteExpired = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).json({ message: ProductMessages.DELETE_SUCCESS });
    } catch (err) {
      next(err);
    }
  };
}
