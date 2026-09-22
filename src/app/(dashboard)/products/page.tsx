import Link from "next/link";
import prisma from "@/lib/prisma";

import { DeleteProductButton } from "@/components/products/delete-product-button"
import { ProductFilters } from "@/components/products/product-filters";

type ProductPageProps = {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
    status?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductPageProps) {
  const params = await searchParams;

  const query = params.query?.trim() ?? "";
  const categoryId = params.categoryId ?? "";

  const status = 
    params.status === "in" ||
    params.status === "low" ||
    params.status === "out"
      ? params.status
      : "";

  const [categories, candidateProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.product.findMany({
      where: {
        archivedAt: null,

        ...(categoryId
          ? {
            categoryId,
          }
        : {}),

        ...(query
          ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      },
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
      },
    }),
  ]);

  const products = candidateProducts.filter((product) => {
    if (status === "out") {
      return product.quantity === 0;
    }

    if (status === "low") {
      return (
        product.quantity > 0 &&
        product.minimumStock > 0 &&
        product.quantity <= product.minimumStock
      );
    }

    if (status === "in") {
      return (
        product.quantity > 0 &&
        (
          product.minimumStock === 0 ||
          product.quantity > product.minimumStock
        )
      );
    }

    return true;
  });

  const hasFilters = 
    Boolean(query) ||
    Boolean(categoryId) ||
    Boolean(status);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your inventory products.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/products/archived"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Archived products
          </Link>
          <Link 
            href="/products/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Add Product
          </Link>
        </div>
      </div>

      <ProductFilters 
        categories={categories}
        query={query}
        categoryId={categoryId}
        status={status}
      />

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            {hasFilters ? (
              <>
                <h2 className="font-medium text-gray-900">
                  No Products found
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  No products match the selected search and filters.
                </p>
                <Link 
                  href="/products"
                  className="mt-4 inline-block rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Clear filters
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-medium text-gray-900">
                  No Products yet
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Create your first product to start managing your inventory.
                </p>
                <Link 
                  href="/products/new"
                  className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  Create Product
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Minimum
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const isLowStock =
                    product.minimumStock > 0 &&
                    product.quantity <= product.minimumStock
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.sku ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.category?.name ?? "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.minimumStock}
                      </td>
                      <td className="px-6 py-4">
                        {isLowStock ? (
                          <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-green-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-baseline justify-end gap-4">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="text-sm font-medium text-gray-700 hover:text-gray-950 hover:underline">
                            Edit
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
        )}
      </div>  
    </div>
  );
}