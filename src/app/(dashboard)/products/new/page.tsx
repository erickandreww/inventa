import { ProductForm } from "@/components/products/product-form";
import prisma from "@/lib/prisma";

export default async function NewProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          New Product
        </h1>

        <p className="mt-1 text-gray-600">
          Add a new product to your inventory.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}