import Link from "next/link";
import prisma from "@/lib/prisma";

import { DeleteCategoryButton } from "@/components/categories/delete-category-button";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="mt-1 text-gray-600">
            Organize your products into categories
          </p>
        </div>

        <Link 
          href="/categories/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Add Category
        </Link>
      </div>
      
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="font-medium text-gray-900">
              No categories yet
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Create your first category to organize your products.
            </p>

            <Link 
            href="/categories/new" 
            className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Create category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">
                    Products
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {category._count.products}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start justify-end gap-4">
                      <Link 
                        href={`/categories/${category.id}/edit`}
                        className="text-sm font-medium text-gray-700 hover:text-gray-950 hover:underline">
                        Edit
                      </Link>
                      <DeleteCategoryButton 
                        categoryId={category.id}
                        categoryName={category.name} />
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