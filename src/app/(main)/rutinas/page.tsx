import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";
import { crearRutina } from "./actions";

export const metadata = { title: "Rutinas" };
export const dynamic = "force-dynamic";

type Rutina = {
  id: string;
  nombre: string;
  ejercicios: { count: number }[];
};

export default async function RutinasPage() {
  const usuario = await getUsuario();
  const { data: rutinas } = await supabase
    .from("rutinas")
    .select("id, nombre, ejercicios(count)")
    .eq("user_id", usuario.id)
    .order("orden", { ascending: true })
    .returns<Rutina[]>();

  return (
    <div>
      <TopBar title="Rutinas" />

      <form action={crearRutina} className="mb-5 flex gap-2">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la rutina (ej: Tren superior)"
          required
          className="flex-1 rounded-xl border border-hairline bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-accent px-4 text-sm font-bold text-white"
        >
          Crear
        </button>
      </form>

      {!rutinas || rutinas.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Hola {usuario.nombre} 👋 — todavía no tenés rutinas creadas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rutinas.map((rutina) => {
            const cantidad = rutina.ejercicios[0]?.count ?? 0;
            return (
              <Link
                key={rutina.id}
                href={`/rutinas/${rutina.id}`}
                className="flex items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5"
              >
                <div>
                  <p className="font-semibold text-ink">{rutina.nombre}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {cantidad} {cantidad === 1 ? "ejercicio" : "ejercicios"}
                  </p>
                </div>
                <span className="text-ink-faint">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
