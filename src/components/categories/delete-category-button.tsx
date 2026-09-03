"use client";

import { FormEvent, useActionState } from "react";

import {
  deleteCategory,
  type DeleteCategoryActionState,
} from "@/actions/categories";

type DeleteCategoryButtonProps = {
  categoryId: string,
  categoryName: string,
};

const initialState: DeleteCategoryActionState = {};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const deleteCategoryWithId = deleteCategory.bind(
    null,
    categoryId,
  );

  const [state, formAction, isPending] = useActionState(
    deleteCategoryWithId,
    initialState,
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryName}"?`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <form 
        action={formAction}
        onSubmit={handleSubmit}
      >
        <button 
          type="submit"
          disabled={isPending}
          className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline disabled:opacity-50">
            {isPending ? "Deleting..." : "Delete"}
          </button>
      </form>

      {state.message && (
        <p className="mt-1 text-xs text-red-600">
          {state.message}
        </p>
      )}
    </div>
  )
}