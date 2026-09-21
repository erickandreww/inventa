"use client";

import { useActionState, useEffect, useRef } from "react";

import { 
  createStockMovement,
  type StockActionState,
} from "@/actions/stock";
import { error } from "console";

type StockMovementFormProps = {
  products: {
    id: string,
    name: string,
    quantity: number,
  }[];
};

const initialState: StockActionState = {};

export function StockMovementForm({
  products,
}: StockMovementFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createStockMovement,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form 
      ref={formRef}
      action={formAction}
      className="space-y-6">
      <div>
        <label 
          htmlFor="productId"
          className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select 
            id="productId"
            name="productId"
            defaultValue=""
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
            aria-describedby="product-error"
          >
            <option value="" disabled>
              Select a product
            </option>

            {products.map((product) => (
              <option 
                key={product.id}
                value={product.id}>
                {product.name} — {product.quantity} in stock
              </option>
            ))}
          </select>

          {state.errors?.productId && (
            <div id="product-error" className="mt-2">
              {state.errors.productId.map((error) => (
                <p
                  key={error}
                  className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label 
            htmlFor="type"
            className="block text-sm font-medium text-gray-700">
            Movement type
          </label>
          <select 
            id="type"
            name="type"
            defaultValue="IN"
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
            aria-describedby="type-error"
          >
            <option value="IN">
              Stock entry
            </option>

            <option value="OUT">
              Stock exit
            </option>
          </select>

          {state.errors?.type && (
            <div id="type-error" className="mt-2">
              {state.errors.type.map((error) => (
                <p
                  key={error}
                  className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label 
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input 
            id="quantity" 
            name="quantity" 
            type="text"
            min="1"
            step="1"
            placeholder="0"
            className="mt-2 w-full rounded-md border border-gray-300 ox-3 py-2 text-gray-900 outline-none focus:border-gray-500"
            aria-describedby="quantity-error" 
          />

          {state.errors?.quantity && (
            <div id="quantity-error" className="mt-2">
              {state.errors.quantity.map((error) => (
                <p 
                  key={error}
                  className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {state.message && (
        <p className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-green-700">
          {state.success}
        </p>
      )}
      
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={isPending || products.length === 0}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isPending ? "Recording..." : "Record movement"}
        </button>
      </div>
    </form>
  )
}