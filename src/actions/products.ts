"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export type ProductActionState = {
  errors?: {
    name?: string[];
    sku?: string[];
    description?: string[];
    price?: string[];
    minimumStock?: string[];
    categoryId?: string[];
  };
  message?: string;
};

export type DeleteProductActionState = {
  message?: string,
};

export async function createProduct(
  previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized.",
    };
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    price: formData.get("price"),
    minimumStock: formData.get("minimumStock"),
    categoryId: formData.get("categoryId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { 
    name,
    sku,
    description,
    price,
    minimumStock,
    categoryId
  } = validatedFields.data;

  const normalizedSku = sku || null;
  const normalizedDescription = description || null;
  const normalizedCategoryId = categoryId || null;

  if (normalizedSku) {
    const existingProduct = await prisma.product.findUnique({
      where: {
        sku: normalizedSku,
      },
    });

    if (existingProduct) {
      return {
        errors: {
          sku: ["A product with this SKU already exists."],
        },
      };
    }
  }

  if (normalizedCategoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: normalizedCategoryId,
      },
    });
    
    if (!category) {
      return {
        errors: {
          categoryId: ["The selected category does not exist."],
        },
      };
    }
  }

  try {
    await prisma.product.create({
      data: {
        name,
        sku: normalizedSku,
        description: normalizedDescription,
        price,
        minimumStock,
        categoryId: normalizedCategoryId,
      },
    });
  } catch {
    return {
      message: "Could not create product. Please try again."
    };
  }

  revalidatePath("/products");
  revalidatePath("/categories");

  redirect("/products");
}

export async function updateProduct(
  productId: string,
  previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    return {
      message: "Unauthorized",
    };
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    price: formData.get("price"),
    minimumStock: formData.get("minimumStock"),
    categoryId: formData.get("categoryId"),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    sku,
    description,
    price,
    minimumStock,
    categoryId
  } = validatedFields.data;

  const normalizedSku = sku || null;
  const normalizedDescription = description || null;
  const normalizedCategoryId = categoryId || null;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  
  if (!product) {
    return {
      message: "Product not found.",
    };
  }

  if (normalizedSku) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: normalizedSku,
        NOT: {
          id: productId,
        },
      },
    });

    if (existingProduct) {
      return {
        errors: {
          sku: ["A product with this SKU already exists."],
        },
      };
    }
  }

  if (normalizedCategoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: normalizedCategoryId,
      },
    });

    if (!category) {
      return {
        errors: {
          categoryId: ["The selected category does not exist."]
        },
      };
    }
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        sku: normalizedSku,
        description: normalizedDescription,
        price,
        minimumStock,
        categoryId: normalizedCategoryId,
      },
    });
  } catch {
    return {
      message: "Could not update product. Please try again.",
    };
  }
  
  revalidatePath("/products");
  revalidatePath("/category");
  
  redirect("/products");
}

export async function deleteProduct(
  productId: string,
  previousState: DeleteProductActionState,
  formData: FormData,
): Promise<DeleteProductActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized",
    };
  };

  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      _count: {
        select: {
          movements: true,
        },
      },
    },
  });

  if (!product) {
    return {
      message: "Product not found.",
    };
  }

  if (product._count.movements > 0) {
    return {
      message: 
        "This category cannot be deleted because it contains products.",
    };
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch {
    return {
      message: "Could not delete product. Please try again"
    };
  }
  
  revalidatePath("/product");
  revalidatePath("/categories");

  return {};
}