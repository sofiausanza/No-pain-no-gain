"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconRutinas,
  IconEntrenamiento,
  IconCalendario,
  IconHidratacion,
} from "@/components/nav-icons";

const items = [
  { href: "/rutinas", label: "Rutinas", Icon: IconRutinas },
  { href: "/entrenamiento", label: "Entrenamiento", Icon: IconEntrenamiento },
  { href: "/calendario", label: "Calendario", Icon: IconCalendario },
  { href: "/hidratacion", label: "Hidratación", Icon: IconHidratacion },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-16 items-center justify-around border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)]">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
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
      })}
    </nav>
  );
}
