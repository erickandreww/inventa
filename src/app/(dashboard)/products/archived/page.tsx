import Link from "next/link";

import prisma from "@/lib/prisma";
import { RestoreProductButton } from "@/components/products/restore-product-button";

export default async function ArchivedProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      archivedAt: {
        not: null,
      },
    },
    orderBy: {
      archivedAt: "desc",
    },
    include: {
      _count: {
        select: {
          movements: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Archived Products
          </h1>
          <p className="mt-1 text-gray-600">
            Review and restore products that were removed from active inventory.
          </p>
        </div>

        <Link
          href="/products"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Back to products
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="font-medium text-gray-900">
              No archived products
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Products archived from your inventory will appear here.
            </p>
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
                    Movements
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Archived
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.sku ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product._count.movements}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {product.archivedAt
                        ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(product.archivedAt)
                      : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <RestoreProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}