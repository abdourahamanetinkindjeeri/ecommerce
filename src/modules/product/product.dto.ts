import { Product, ProductStatus } from "@prisma/client";

// DTO pour création
export type CreateProductDto = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
> & {
  title: string;
  description?: string;
  price: number;
  imageUrls: string[]; // tableau d'URLs d'images
  status?: ProductStatus;
  dateExpiration?: Date;
  userId: string;
  categoryId: string;
};

// DTO pour mise à jour
export type UpdateProductDto = Partial<CreateProductDto>;
