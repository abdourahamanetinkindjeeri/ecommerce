// Category.controller.ts
import { Category } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import PrismaService from "../abstract/PrismaService.js";
import { CategoryMessages, CategoryValidationRules } from "./category.enum.js";

import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prismaClient.js";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";

const CategoryBaseSchema = {
  libelle: z
    .string()
    .min(
      CategoryValidationRules.MIN_LIBELLE_LENGTH,
      CategoryMessages.LIBELLE_REQUIRED
    ),
  description: z.string().nullable().optional(),
};

export class CategoryController extends BaseController<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  protected service: PrismaService<
    Category,
    CreateCategoryDto,
    UpdateCategoryDto
  >;

  protected createSchema = z.object(CategoryBaseSchema) as z.ZodType<
    Omit<CreateCategoryDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
    })
    .merge(
      z.object(CategoryBaseSchema).partial()
    ) as z.ZodType<UpdateCategoryDto>;

  constructor(
    service: PrismaService<Category, CreateCategoryDto, UpdateCategoryDto>
  ) {
    super();
    this.service = service;
  }

  // Surcharger les méthodes pour utiliser les messages personnalisés
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = this.createSchema?.parse(req.body) ?? req.body;
      const entity = await this.service.create(data);
      res
        .status(201)
        .json({ message: CategoryMessages.CREATION_SUCCESS, entity });
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

      let entities = await this.service.findAll({ skip, take: limit, search });

      res.status(200).json({
        page,
        limit,
        count: entities.length,
        data: entities,
        message: CategoryMessages.LIST_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const entity = await this.service.findById(id);
      if (!entity)
        return res.status(404).json({ error: CategoryMessages.NOT_FOUND });
      res
        .status(200)
        .json({ data: entity, message: CategoryMessages.DETAIL_SUCCESS });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data: UpdateCategoryDto =
        this.updateSchema?.parse(req.body) ?? req.body;
      const entity = await this.service.update(id, data);
      if (!entity)
        return res.status(404).json({ error: CategoryMessages.NOT_FOUND });
      res
        .status(200)
        .json({ data: entity, message: CategoryMessages.UPDATE_SUCCESS });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).json({ message: CategoryMessages.DELETE_SUCCESS });
    } catch (err) {
      next(err);
    }
  };
}
