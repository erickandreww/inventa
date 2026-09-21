"use client";

import { useActionState } from "react";

import {
  restoreProduct,
  type RestoreProductActionState,
} from "@/actions/products";

type RestoreProductButtonProps = {
  productId: string;
};

const initialState: RestoreProductActionState = {};

export function RestoreProductButton({
  productId,
}: RestoreProductButtonProps) {
  const restoreProductWithId = restoreProduct.bind(
    null,
    productId,
  );

  const [state, formAction, isPending] = useActionState(
    restoreProductWithId,
    initialState,
  );

  return (
    <div>
      <form action={formAction}>
        <button 
          type="submit"
          disabled={isPending}
          className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline disabled:opacity-50"
          >
          {isPending ? "Restoring..." : "Restore"}
        </button>
      </form>

      {state.message && (
        <p className="mt-1 text-xs text-red-600">
          {state.message}
        </p>
      )}
    </div>
  );
}