"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stockMovementSchema } from "@/lib/validations/stock";

export type StockActionState = {
  errors?: {
    productId?: string[];
    type?: string[];
    quantity?: string[];
  };
  message?: string;
  success?: string;
}

export async function createStockMovement(
  previousState: StockActionState,
  formData: FormData,
): Promise<StockActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "Unauthorized.",
    };
  }

  const validatedFields = stockMovementSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    productId,
    type,
    quantity,
  } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: productId,
          archivedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
      
      if (type === "IN") {
        await tx.product.update({
          where: {
            id: productId,
          }, 
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
      }

      if (type === "OUT") {
        const updateResult = await tx.product.updateMany({
          where: {
            id: productId,
            archivedAt: null,
            quantity: {
              gte: quantity,
            },
          },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
        },
      });
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      return {
        errors: {
          productId: ["Product not found."],
        },
      };
    }

    if (
      error instanceof Error && 
      error.message === "INSUFFICIENT_STOCK"
    ) {
      return {
        errors: {
          quantity: ["Insufficient stock for this operation."],
        },
      };
    }

    return {
      message: "Could not record stock movement. Please try again.",
    };
  };

  revalidatePath("/stock");
  revalidatePath("/products");
  revalidatePath("dashboard");

  return {
    success: "Stock movement recorded successfully.",
  };
}