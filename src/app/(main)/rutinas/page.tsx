import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";

export const metadata = { title: "Rutinas" };
export const dynamic = "force-dynamic";

type Rutina = {
  id: string;
  nombre: string;
};

export default async function RutinasPage() {
  const usuario = await getUsuario();
  const { data: rutinas } = await supabase
    .from("rutinas")
    .select("id, nombre")
    .eq("user_id", usuario.id)
    .order("orden", { ascending: true })
    .returns<Rutina[]>();

  return (
    <div>
      <div className="flex items-center justify-between">
        <TopBar title="Rutinas" avatarLetter={usuario.nombre[0]} />
      </div>

      {!rutinas || rutinas.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Hola {usuario.nombre} 👋 — todavía no tenés rutinas creadas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rutinas.map((rutina) => (
            <div
              key={rutina.id}
              className="rounded-2xl border border-hairline bg-surface px-4 py-3.5"
            >
              <p className="font-semibold text-ink">{rutina.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
