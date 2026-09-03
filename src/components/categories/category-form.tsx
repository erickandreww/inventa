"use client";

import Link from "next/link";
import { useActionState } from "react";

import { 
  createCategory,
  updateCategory,
  type CategoryActionState,
} from "@/actions/categories";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
  };
};

const initialState: CategoryActionState = {};

export function CategoryForm({
  category,
}: CategoryFormProps) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  const [state, formAction, isPending] = useActionState(
    action, 
    initialState,
  );

  const isEditing = Boolean(category);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label 
          htmlFor="name"
          className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input 
          id="name"
          name="name" 
          type="text"
          defaultValue={category?.name ?? ""}
          placeholder="e.g Eletronics"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
          aria-describedby="name-error"
          />

        {state.errors?.name && (
          <div id="name-error" className="mt-2">
            {state.errors.name.map((error) => (
              <p key={error} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {state.message && (
        <p className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link 
          href="/categories"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isPending 
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing 
              ? "Save changes"
              : "Create category"}
        </button>
      </div>
    </form>
  )
}