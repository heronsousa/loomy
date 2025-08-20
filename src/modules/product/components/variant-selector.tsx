import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectVariant: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

export const VariantSelector = ({ variants, selectVariant }: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          href={`/product/${variant.slug}`}
          key={variant.id}
          className={
            selectVariant === variant.slug
              ? "border-primary rounded-xl border"
              : ""
          }
        >
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            width={60}
            height={60}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

