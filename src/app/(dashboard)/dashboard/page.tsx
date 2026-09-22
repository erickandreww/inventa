import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    products,
    categoriesCount,
    recentMovements,
  ] = await Promise.all([
    prisma.product.findMany({
      where: {
        archivedAt: null,
      },
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        minimumStock: true,
      },
    }),

    prisma.category.count(),

    prisma.stockMovement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity, 0,
  );

  const inventoryValue = products.reduce(
    (total, product) => 
      total + Number(product.price) * product.quantity, 0,
  );

  const lowStockProducts = products.filter(
    (product) => 
      product.minimumStock > 0 &&
      product.quantity <= product.minimumStock,
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          Overview of your inventory.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Active Products
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Categories
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {categoriesCount}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Units in Stock
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalUnits}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Inventory Value
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {inventoryValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Low Stock Products
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Products that have reached their minimum stock level.
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              {lowStockProducts.length}
            </span>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-600">
              No products are currently low on stock.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lowStockProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum stock: {product.minimumStock}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-red-700">
                    {product.quantity} available
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Movements
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Latest inventory entries and exits.
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              <Link 
                href="/stock"
                className="text-sm font-medium text-gray-700 hover:text-gray-950 hover:underline"
              >
                View all
              </Link>
            </span>
          </div>
        </div>

        {recentMovements.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-600">
              No Stock movements yet
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
                {recentMovements.map((movement) => (
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
                        }
                      >
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
  );
}