"server only";

import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type ProductsDTO = (typeof productTable.$inferSelect & {
  variants: (typeof productVariantTable.$inferSelect)[];
})[];

type ProductFindManyArgs = Parameters<typeof db.query.productTable.findMany>[0];

const DEFAULT_PRODUCT_QUERY: ProductFindManyArgs = {
  with: {
    variants: true,
  },
};

export const getProducts = async (query?: ProductFindManyArgs) => {
  return (await db.query.productTable.findMany({
    ...DEFAULT_PRODUCT_QUERY,
    ...query,
  })) as ProductsDTO;
};

export const getNewlyCreatedProducts = async () => {
  return await getProducts({
    orderBy: [desc(productTable.createdAt)],
  });
};

export const getProductsInCategory = async (categoryId: string) => {
  return await getProducts({
    where: eq(productTable.categoryId, categoryId)
  });
}