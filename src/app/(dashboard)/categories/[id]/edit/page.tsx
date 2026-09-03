import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { CategoryForm } from "@/components/categories/category-form";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Category
        </h1>
        <p className="mt-1 text-gray-600">
          Update the category information.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <CategoryForm 
          category={{
            id: category.id,
            name: category.name,
          }} 
        />
      </div>
    </div>
  );
}