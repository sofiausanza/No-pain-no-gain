import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";

export const metadata = { title: "Calendario" };
export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const usuario = await getUsuario();

  return (
    <div>
      <TopBar title="Calendario" avatarLetter={usuario.nombre[0]} />
      <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
        <p className="text-sm text-ink-soft">
          Acá va a estar el calendario con los días entrenados. Todavía en
          construcción.
        </p>
      </div>
    </div>
  );
}
