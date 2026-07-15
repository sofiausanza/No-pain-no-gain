import { BottomNav } from "@/components/bottom-nav";
import { getUsuario } from "@/lib/usuario";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getUsuario();

  return (
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-md px-4 pt-6">{children}</div>
      <BottomNav avatarLetter={usuario.nombre[0]} />
    </div>
  );
}
