"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconRutinas,
  IconEntrenamiento,
  IconCalendario,
  IconHidratacion,
} from "@/components/nav-icons";

const izquierda = [
  { href: "/rutinas", label: "Rutinas", Icon: IconRutinas },
  { href: "/entrenamiento", label: "Entrenamiento", Icon: IconEntrenamiento },
];

const derecha = [
  { href: "/calendario", label: "Calendario", Icon: IconCalendario },
  { href: "/hidratacion", label: "Hidratación", Icon: IconHidratacion },
];

function NavLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: () => React.ReactElement;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-[68px] flex-col items-center gap-1 ${
        active ? "text-accent" : "text-ink-faint"
      }`}
    >
      <Icon />
      <span className="whitespace-nowrap text-[8px] font-bold tracking-tight">
        {label}
      </span>
    </Link>
  );
}

export function BottomNav({ avatarLetter }: { avatarLetter: string }) {
  const pathname = usePathname();
  const perfilActivo = pathname === "/perfil";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-16 items-center justify-around border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)]">
      {izquierda.map(({ href, label, Icon }) => (
        <NavLink key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
      ))}

      <Link href="/perfil" className="flex w-[68px] flex-col items-center gap-1">
        <span
          className={`-mt-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent text-base font-extrabold shadow-lg shadow-black/50 ${
            perfilActivo ? "bg-accent text-white" : "bg-base text-accent"
          }`}
        >
          {avatarLetter}
        </span>
        <span
          className={`whitespace-nowrap text-[8px] font-bold tracking-tight ${
            perfilActivo ? "text-accent" : "text-ink-faint"
          }`}
        >
          Perfil
        </span>
      </Link>

      {derecha.map(({ href, label, Icon }) => (
        <NavLink key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
      ))}
    </nav>
  );
}
