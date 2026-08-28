import { NavLinks } from "@/components/layout/nav-links";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-gray-900">
          Inventa
        </span>
      </div>

      <div className="flex-1 p-4">
        <NavLinks />
      </div>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500">
          Inventory Management
        </p>
      </div>
    </aside>
  )
}