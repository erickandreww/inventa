import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/products/product-form";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPAge({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id,
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name:true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Product
        </h1>
        <p className="mt-1 text-gray-600">
          Update the product information
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm 
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku ?? "",
            description: product.description ?? "",
            price: product.price.toString(),
            minimumStock: product.minimumStock,
            categoryId: product.categoryId ?? "",
          }}
        />
      </div>
    </div>
  )
}