import { NavLinks } from "@/components/layout/nav-links";

export function SideBar() {
  return (
    <aside className="hidden w-64 shrink-0 border-0 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold">
          Inventa
        </span>
      </div>

      <div className="flex-1 p-4">
        <NavLinks />
      </div>

      <div className="border-t p-4">
        <p className="text-xs text-gray-500">
          Inventory Management
        </p>
      </div>
    </aside>
  )
}