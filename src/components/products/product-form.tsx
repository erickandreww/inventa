"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createProduct,
  updateProduct,
  type ProductActionState,
} from "@/actions/products";

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];

  product?: {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: string;
    minimumStock: number;
    categoryId: string;
  };
};

const initialState: ProductActionState = {};

export function ProductForm({
  categories,
  product,
}: ProductFormProps) {
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct;
  
  const [state, formAction, isPending] = useActionState(
    action,
    initialState,
  );

  const isEditing = Boolean(product);

  return(
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name"
          className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input 
          id="name"
          name="name"
          type="text"
          defaultValue={product?.name ?? ""}
          placeholder="e.g. Wireless Keyboard"
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

      <div>
        <label 
          htmlFor="sku"
          className="block text-sm font-medium text-gray-700">
            SKU
        </label>
        <input 
          id="sku"
          name="sku"
          type="text"
          defaultValue={product?.sku ?? ""}
          placeholder="e.g. KEY-001"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
          aria-describedby="sky-error"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional unique identifier for the product.
        </p>
        {state.errors?.sku && (
          <div id="sku-error" className="mt-2">
            {state.errors.sku.map((error) => (
              <p key={error} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label 
          htmlFor="description"
          className="block text-sm font-medium text-gray-700">
            Description
        </label>
        <textarea 
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="Optional product description"
          className="mt-2 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
          aria-describedby="description-error"
        />
        {state.errors?.description && (
          <div id="description-error" className="mt-2">
            {state.errors.description.map((error) => (
              <p key={error} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label 
            htmlFor="price"
            className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input 
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={product?.price ?? ""}
            placeholder="0.00"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
            aria-describedby="price-error" 
          />
          {state.errors?.price && (
            <div id="price-error" className="mt-2">
              {state.errors.price.map((error) => (
                <p key={error} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label 
            htmlFor="minimumStock"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Stock
          </label>
          <input 
            id="minimumStock"
            name="minimumStock"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.minimumStock ?? 0}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
            aria-describedby="minimum-stock-error"
          />
          {state.errors?.minimumStock && (
            <div id="minimum-stock-error" className="mt-2">
              {state.errors.minimumStock.map((error) => (
                <p key={error} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700">
            Category
        </label>
        <select 
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
          aria-describedby="category-error"
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state.errors?.categoryId && (
          <div id="category-error" className="mt-2">
            {state.errors.categoryId.map((error) => (
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
          href="/products"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
        </Link>
        <button 
          type="submit"
          disabled={isPending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending 
            ? isEditing
              ? "Saving..."
              : "Creating..." 
            : isEditing
              ? "Save Changes"
              : "Create product"}
        </button>
      </div>
    </form>
  );
}