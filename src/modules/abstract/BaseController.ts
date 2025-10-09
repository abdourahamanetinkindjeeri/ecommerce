import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import IPrismaService from "./IPrismaService.js";
import { BaseMessages } from "./abstract.enum.js";

export default abstract class BaseController<
  T extends { id: string | number },
  CreateDTO,
  UpdateDTO
> {
  protected abstract service: IPrismaService<T, CreateDTO, UpdateDTO>;
  protected abstract createSchema?: ZodSchema<
    Omit<CreateDTO, "id" | "createdAt" | "updatedAt">
  >;
  protected abstract updateSchema?: ZodSchema<UpdateDTO>;

  // Méthode pour permettre aux classes enfants de formatter les entités
  protected formatEntity(entity: T): any {
    return entity;
  }

  // Méthode pour permettre aux classes enfants de formatter les listes
  protected formatEntities(entities: T[]): any[] {
    return entities.map((entity) => this.formatEntity(entity));
  }

  // Méthodes pour permettre aux classes enfants de personnaliser les messages
  protected getCreationMessage(): string {
    return BaseMessages.CREATION_SUCCESS;
  }

  protected getListMessage(): string {
    return BaseMessages.LIST_SUCCESS;
  }

  protected getDetailMessage(): string {
    return BaseMessages.DETAIL_SUCCESS;
  }

  protected getUpdateMessage(): string {
    return BaseMessages.UPDATE_SUCCESS;
  }

  protected getDeleteMessage(): string {
    return BaseMessages.DELETE_SUCCESS;
  }

  protected getNotFoundMessage(): string {
    return BaseMessages.NOT_FOUND;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = this.createSchema?.parse(req.body) ?? req.body;
      const entity = await this.service.create(data);
      res.status(201).json({
        message: this.getCreationMessage(),
        entity: this.formatEntity(entity),
      });
    } catch (err) {
      next(err);
    }
  }

  // --- GET ALL avec pagination ---
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || undefined;

      let entities = await this.service.findAll({ skip, take: limit, search });

      // --- Filtrage entreprise si applicable ---
      const entrepriseId = (req as any).user?.entrepriseId;
      if (entrepriseId && entities.length) {
        const first = entities[0] as any;
        if ("entrepriseId" in first) {
          entities = entities.filter(
            (e: any) => e.entrepriseId === entrepriseId
          );
        } else if ("clientId" in first) {
          entities = entities.filter(
            (e: any) => e.client?.entrepriseId === entrepriseId
          );
        }
      }

      res.status(200).json({
        page,
        limit,
        count: entities.length,
        data: this.formatEntities(entities),
        message: this.getListMessage(),
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
        return res.status(404).json({ error: this.getNotFoundMessage() });
      res
        .status(200)
        .json({
          data: this.formatEntity(entity),
          message: this.getDetailMessage(),
        });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data: UpdateDTO = this.updateSchema?.parse(req.body) ?? req.body;
      const entity = await this.service.update(id, data);
      if (!entity)
        return res.status(404).json({ error: this.getNotFoundMessage() });
      res
        .status(200)
        .json({
          data: this.formatEntity(entity),
          message: this.getUpdateMessage(),
        });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).json({ message: this.getDeleteMessage() });
    } catch (err) {
      next(err);
    }
  };
}
