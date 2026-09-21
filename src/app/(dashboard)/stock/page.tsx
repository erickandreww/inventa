import Link from "next/link";

import prisma from "@/lib/prisma";
import { StockMovementForm } from "@/components/stock/stock-movement-form";
import { StockHistory } from "@/components/stock/stock-history";

type StockPageProps = {
  searchParams: Promise<{
    productId?: string;
    type?: string;
  }>;
}

export default async function StockPage({
  searchParams,
}: StockPageProps) {
  const params = await searchParams;

  const productId = params.productId;
  const type = 
    params.type === "IN" || params.type === "OUT"
      ? params.type
      : undefined;

  const products = await prisma.product.findMany({
    where: {
      archivedAt: null
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      quantity: true,
    },
  });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Stock
        </h1>

        <p className="mt-1 text-gray-600">
          Record inventory entries and exits.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          New Movement
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Select a product and record an inventory movement.
        </p>

        {products.length === 0 ? (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              You need at least one product before recording stock movements.
            </p>
            <Link 
              href="/products/new"
              className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
            >
              Create a product
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <StockMovementForm products={products} />
          </div>
        )}
      </div>

      <StockHistory 
        productId={productId}
        type={type}
      />
    </div>
  );
}