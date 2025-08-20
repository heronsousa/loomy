import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { getCategoryBySlug } from "@/modules/category";
import { getProductsInCategory } from "@/modules/product";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return notFound;
  }

  const products = await getProductsInCategory(category.id);

  return (
    <>
      <Header />

      <div className="space-y-6 px-5">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassname="max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};
 
export default CategoryPage;