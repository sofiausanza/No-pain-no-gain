import { notFound } from "next/navigation";
import { SubTopBar } from "@/components/sub-top-bar";
import { ConfirmButton } from "@/components/confirm-button";
import { supabase } from "@/lib/supabase";
import { crearEjercicio, eliminarEjercicio, eliminarRutina } from "../actions";

export const dynamic = "force-dynamic";

type Ejercicio = {
  id: string;
  nombre: string;
};

export default async function RutinaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: rutina } = await supabase
    .from("rutinas")
    .select("id, nombre")
    .eq("id", id)
    .single();

  if (!rutina) notFound();

  const { data: ejercicios } = await supabase
    .from("ejercicios")
    .select("id, nombre")
    .eq("rutina_id", id)
    .order("orden", { ascending: true })
    .returns<Ejercicio[]>();

  const eliminarEjercicioDeRutina = eliminarEjercicio.bind(null, id);
  const eliminarEstaRutina = eliminarRutina.bind(null, id);
  const crearEjercicioEnRutina = crearEjercicio.bind(null, id);

  return (
    <div>
      <SubTopBar title={rutina.nombre} backHref="/rutinas" />

      <form action={crearEjercicioEnRutina} className="mb-5 flex gap-2">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del ejercicio (ej: Press banca)"
          required
          className="flex-1 rounded-xl border border-hairline bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-accent px-4 text-sm font-bold text-white"
        >
          Agregar
        </button>
      </form>

      {!ejercicios || ejercicios.length === 0 ? (
        <div className="mb-6 rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Todavía no agregaste ejercicios a esta rutina.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex flex-col gap-2.5">
          {ejercicios.map((ejercicio) => (
            <div
              key={ejercicio.id}
              className="flex items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5"
            >
              <div>
                <p className="font-semibold text-ink">{ejercicio.nombre}</p>
                <p className="mt-0.5 text-xs text-ink-faint">4 series</p>
              </div>
              <form action={eliminarEjercicioDeRutina.bind(null, ejercicio.id)}>
                <ConfirmButton
                  message={`¿Borrar "${ejercicio.nombre}" de esta rutina?`}
                  className="text-xs font-semibold text-ink-faint"
                >
                  Borrar
                </ConfirmButton>
              </form>
            </div>
          ))}
        </div>
      )}

      <form action={eliminarEstaRutina}>
        <ConfirmButton
          message={`¿Borrar la rutina "${rutina.nombre}" y todos sus ejercicios? Esto no se puede deshacer.`}
          className="w-full rounded-xl border border-accent-press/60 py-3 text-sm font-bold text-accent-press"
        >
          Borrar rutina
        </ConfirmButton>
      </form>
    </div>
  );
}
