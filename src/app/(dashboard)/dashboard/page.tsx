import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2x1 font-bold">Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Welcome to Inventa
      </p>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}