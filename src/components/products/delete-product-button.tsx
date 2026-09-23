"use client";

import { FormEvent, useActionState } from "react";

import {
  deleteProduct,
  type DeleteProductActionState,
} from "@/actions/products";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

const initialState: DeleteProductActionState = {};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const deleteProductWithId = deleteProduct.bind(
    null,
    productId,
  );

  const [state, formAction, isPending] = useActionState(
    deleteProductWithId,
    initialState,
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${productName}"?`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <form 
        action={formAction}
        onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={isPending}
          className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline disabled=opacity-50">
            {isPending ? "Removing..." : "Remove"}
          </button>
      </form>

      {state.message && (
        <p className="mt-1 max-w-52 text-xs text-red-600">
          {state.message}
        </p>
      )}
    </div>
  );
}