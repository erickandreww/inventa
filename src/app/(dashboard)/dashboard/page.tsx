import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardPage() {
  return (
    <div>
      <div>
        <h1 className="text-2x1 font-bold">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview of your inventory.
        </p>
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6">
        <p className="text-gray-600">
          Dashboard content will be added later.
        </p>
      </div>
    </div>
  );
}