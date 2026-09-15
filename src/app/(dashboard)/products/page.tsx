import Link from "next/link";
import prisma from "@/lib/prisma";

import { DeleteProductButton } from "@/components/products/delete-product-button"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      category:true,
    },
  });

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
        <Link 
          href="/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Add Product
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center">
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
                  <th className="px-6 py-3 text-right font-medium text-gray-700">
                    Actions
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
                ))}
              </tbody>
            </table>
        </div>
        )}
      </div>  
    </div>
  );
}