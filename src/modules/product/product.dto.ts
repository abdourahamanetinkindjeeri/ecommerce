import { Product, ProductStatus } from "@prisma/client";

// DTO pour création
export type CreateProductDto = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "images"
> & {
  title: string;
  description?: string;
  price: number;
  imageUrls: string[]; // tableau d'URLs d'images
  status?: ProductStatus;
  dateExpiration?: Date;
  userId: string;
  categoryId: string;
  views?: number;
};

// DTO pour mise à jour
export type UpdateProductDto = Partial<CreateProductDto>;
