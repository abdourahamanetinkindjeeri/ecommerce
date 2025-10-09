import { Product, ProductStatus } from "@prisma/client";

// DTO pour création
export type CreateProductDto = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
> & {
  // Tous les champs requis/optionnels du modèle
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status?: ProductStatus; // Par défaut EN_ATTENTE
  dateExpiration?: Date;
  userId: string;
  categoryId: string;
};

// DTO pour mise à jour
export type UpdateProductDto = Partial<CreateProductDto>;
