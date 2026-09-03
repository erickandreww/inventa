import { CategoryForm } from "@/components/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          New Category
        </h1>

        <p className="mt-1 text-gray-600">
          Create a category to organize your products.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <CategoryForm />
      </div>
    </div>
  )
}