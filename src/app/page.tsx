import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link 
            href="/"
            className="text-xl font-bold text-gray-900">
            Inventa
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Inventory Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Keep your inventory organized and under control.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Inventa helps you manage products, categories and stock
            movements while keeping track of inventory levels and
            low-stock items.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            {session ? (
              <Link 
                href="/dashboard"
                className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                  Create an account
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900">
              Product Management
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Organize products, categories, prices and minimum stock
              levels in one place.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900">
              Stock Control
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Record inventory entries and exits while preserving a 
              complete movement history.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900">
              Inventory Overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Monitor stock levels, inventory value and low-stock products
              directly from the dashboard.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          Inventa - Inventory Management System
        </div>
      </footer>
    </main>
  );
}
