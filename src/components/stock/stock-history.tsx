import Link from "next/link";

import prisma from "@/lib/prisma";
import { StockMovementForm } from "@/components/stock/stock-movement-form";

type StockHistoryProps = {
  productId?: string;
  type?: "IN" | "OUT";
};

export async function StockHistory({
  productId,
  type,
}: StockHistoryProps) {
  const [filterProducts, movements] = await Promise.all([
    prisma.product.findMany({
      where: {
        movements: {
          some: {},
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.stockMovement.findMany({
      where: {
        ...(productId ? { productId } : {}),
        ...(type ? { type } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      take: 50,
    }),
  ]);
  
  return (
    <div className="mt-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Movements
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Review recent inventory entries and exits.
        </p>
      </div>

      <form 
        method="GET" 
        className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label 
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select 
            id="productId" 
            name="productId"
            defaultValue={productId ?? ""}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900">
            <option value="">All Products</option>
            {filterProducts.map((product) => (
              <option 
                key={product.id}
                value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label 
            htmlFor="type"
            className="block text-sm font-medium text-gray-700">
            Movement type
          </label>
          <select 
            id="type" 
            name="type"
            defaultValue={type ?? ""}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
          >
            <option value="">All movements</option>
            <option value="IN">Entries</option>
            <option value="OUT">Exits</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Apply filters
          </button>
          <Link 
            href="/stock"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Clear
          </Link>
        </div>
      </form>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {movements.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-600">
              No stock movements found
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {movement.product.name}
                    </td>

                    <td className="px-6 py-4">
                      <span 
                        className={
                          movement.type === "IN"
                            ? "font-medium text-green-700"
                            : "font-medium text-red-700"
                        }>
                        {movement.type === "IN"
                          ? "Entry"
                          : "Exit"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {movement.type === "IN" ? "+" : "-"}
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(movement.createdAt)}
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