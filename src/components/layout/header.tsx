import { LogoutButton } from "@/components/auth/logout-button";
import { NavLinks } from "@/components/layout/nav-links";

type HeaderProps = {
  user: {
    name: string;
    email: string;
  };
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div>
          <p className="text-sm text-gray-500">
            Welcome back
          </p>
          <p className="font-medium">
            {user.name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
          
          <LogoutButton />
        </div>
      </div>

      <div className="border-t px-4 py-2 md:hidden">
        <NavLinks mobile />
      </div>
    </header>
  )
}