import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type AuthLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({
  children,
}: AuthLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
  
  return <>{children}</>
}