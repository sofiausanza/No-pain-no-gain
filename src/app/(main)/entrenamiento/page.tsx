import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";

export const metadata = { title: "Entrenamiento" };
export const dynamic = "force-dynamic";

export default async function EntrenamientoPage() {
  const usuario = await getUsuario();

  return (
    <div>
      <TopBar title="Entrenamiento" avatarLetter={usuario.nombre[0]} />
      <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
        <p className="text-sm text-ink-soft">
          Acá va a estar el botón para comenzar un entrenamiento. Todavía en
          construcción.
        </p>
      </div>
    </div>
  );
}
