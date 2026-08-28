"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await authClient.signOut();

      router.replace("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button type="submit" onClick={handleLogout} disabled={isPending} 
    className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
      {isPending ? "Loging out" : "Logout"}
    </button>
  )
}