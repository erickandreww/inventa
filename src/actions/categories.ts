"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export type CategoryActionState = {
  errors?: {
    name?: string[];
  };
  message?: string;
};

export type DeleteCategoryActionState = {
  message?: string;
};

export async function createCategory(
  previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized.",
    };
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    return {
      errors: {
        name: ["A category with this name already exists."],
      },
    };
  }

  try {
    await prisma.category.create({
      data: {
        name,
      },
    });
  } catch {
    return {
      message: "Could not create category. Please try again.",
    };
  }

  revalidatePath("/categories");
  redirect("/categories");
}


export async function updateCategory(
  categoryId: string,
  previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized.",
    };
  }

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return {
      message: "Category not found.",
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: {
        id: categoryId,
      },
    },
  });

  if (existingCategory) {
    return {
      errors: {
        name: ["A category with this name already exists."],
      },
    };
  }

  try {
    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
    });
  } catch {
    return {
      message: "Could not update category. Please try again.",
    };
  }

  revalidatePath("/categories");
  redirect("/categories");
}


export async function deleteCategory(
  categoryId: string,
  previousState: DeleteCategoryActionState,
  formData: FormData
): Promise<DeleteCategoryActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized."
    };
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    return {
      message: "Category not found.",
    }
  }

  if (category._count.products > 0) {
    return {
      message: 
        "This category cannot be deleted because it contains products",
    };
  }

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch {
    return {
      message: "Could not delete category. Please try again.",
    };
  }

  revalidatePath("/categories");

  return {};
}