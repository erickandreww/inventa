"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    setError("");
    setIsPending(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setIsPending(false);

    if (error) {
      setError(error.message ?? "Could not create acount.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-600">Create an account to access Inventa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} 
            required className="w-full rounded-md border px-3 py-2"/>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} 
            required className="w-full rounded-md border px-3 py-2"/>
          </div>
          
          <div  className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)}
            required minLength={8} className="w-full rounded-md border px-3 py-2"/>
          </div>

          {error && (
            <p className="text-sm text-red-600" >{error}</p>
          )}

          <button type="submit" disabled={isPending} 
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50">
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="login" className="font-medium text-black underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
  
}