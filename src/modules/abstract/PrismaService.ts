import IModelDelegate from "./IModelDelegate.js";
import IPrismaService from "./IPrismaService.js";

export default class PrismaService<T, CreateDTO, UpdateDTO>
  implements IPrismaService<T, CreateDTO, UpdateDTO>
{
  public modelName: string;
  constructor(
    private model: IModelDelegate<T, CreateDTO, UpdateDTO>,
    modelName?: string
  ) {
    this.modelName = modelName || "";
  }

  /**
   * Recherche avec filtre personnalisé (ex: where, include)
   */
  async findManyWithFilter(args: any): Promise<T[]> {
    if (this.modelName === "paiement") {
      // Pour paiement, filtrer via employe.entrepriseId
      const where = args.where || {};
      if (where.entrepriseId) {
        const entrepriseId = where.entrepriseId;
        delete where.entrepriseId;
        where.employe = { entrepriseId };
      }
      return this.model.findMany({
        ...args,
        where,
        include: {
          employe: {
            select: {
              entrepriseId: true,
              nom: true,
              prenom: true,
              matricule: true,
            },
          },
          payslip: {
            select: { id: true, numero: true },
          },
        },
      });
    }
    return this.model.findMany(args);
  }

  async create(data: CreateDTO): Promise<T> {
    return this.model.create({ data });
  }
  async findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<T[]> {
    const { skip, take, search } = options || {};

    if (this.modelName === "paiement") {
      // Inclure l'employé pour exposer entrepriseId au top-level (utile pour filtres frontend)
      const rows: any[] = await (this.model as any).findMany({
        where: { deletedAt: null },
        include: {
          employe: {
            select: {
              entrepriseId: true,
              nom: true,
              prenom: true,
              matricule: true,
            },
          },
          payslip: {
            select: { id: true, numero: true },
          },
        },
        skip,
        take,
      });
      return rows.map((p: any) => ({
        ...p,
        entrepriseId: p.employe?.entrepriseId,
      }));
    }

    if (this.modelName === "utilisateur") {
      return (this.model as any).findMany({
        include: {
          employe: true,
        },
        skip,
        take,
      });
    }

    // Pour les autres modèles (user, product, category)
    const whereClause: any = {};
    if (search) {
      // Recherche basique par nom/titre selon le modèle
      if (this.modelName === "user") {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      } else if (this.modelName === "product") {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      } else if (this.modelName === "category") {
        whereClause.OR = [
          { libelle: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }
    }

    return this.model.findMany({
      where: whereClause,
      skip,
      take,
      ...(this.modelName === "product" && {
        include: {
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, libelle: true } },
        },
      }),
    });
  }
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }
  async update(id: string, data: UpdateDTO): Promise<T> {
    return this.model.update({ where: { id }, data });
  }
  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
