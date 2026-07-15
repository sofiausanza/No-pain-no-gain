import { notFound } from "next/navigation";
import { SubTopBar } from "@/components/sub-top-bar";
import { Timer } from "@/components/timer";
import { supabase } from "@/lib/supabase";
import { getSeriesPrevias } from "@/lib/series-previas";
import { formatearDuracion } from "@/lib/formato";
import { terminarEntrenamiento } from "../actions";
import { SetRow } from "./set-row";

export const dynamic = "force-dynamic";

type Serie = {
  id: string;
  ejercicio_id: string | null;
  ejercicio_nombre: string;
  numero_serie: number;
  peso_kg: number | null;
  repeticiones: number | null;
  completada: boolean;
};

type EntrenamientoDetalle = {
  id: string;
  rutina_nombre: string;
  iniciado_en: string;
  finalizado_en: string | null;
  comentario: string | null;
};

export default async function EntrenamientoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: entrenamiento } = await supabase
    .from("entrenamientos")
    .select("id, rutina_nombre, iniciado_en, finalizado_en, comentario")
    .eq("id", id)
    .single<EntrenamientoDetalle>();

  if (!entrenamiento) notFound();

  const { data: series } = await supabase
    .from("series_entrenamiento")
    .select(
      "id, ejercicio_id, ejercicio_nombre, numero_serie, peso_kg, repeticiones, completada"
    )
    .eq("entrenamiento_id", id)
    .order("numero_serie", { ascending: true })
    .returns<Serie[]>();

  const porEjercicio = new Map<string, Serie[]>();
  for (const serie of series ?? []) {
    if (!porEjercicio.has(serie.ejercicio_nombre)) {
      porEjercicio.set(serie.ejercicio_nombre, []);
    }
    porEjercicio.get(serie.ejercicio_nombre)!.push(serie);
  }

  const activa = !entrenamiento.finalizado_en;

  const ejercicioIds = Array.from(
    new Set(
      (series ?? [])
        .map((s) => s.ejercicio_id)
        .filter((x): x is string => x !== null)
    )
  );
  const previas = activa
    ? await getSeriesPrevias(ejercicioIds, id)
    : new Map();

  return (
    <div>
      <SubTopBar title={entrenamiento.rutina_nombre} backHref="/entrenamiento" />

      <div className="mb-4 rounded-2xl border border-hairline bg-surface p-4 text-center">
        {activa ? (
          <Timer iniciadoEn={entrenamiento.iniciado_en} />
        ) : (
          <p className="font-display text-2xl font-extrabold text-ink">
            {formatearDuracion(
              entrenamiento.iniciado_en,
              entrenamiento.finalizado_en!
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from(porEjercicio.entries()).map(([nombre, seriesEjercicio]) => {
          const completas = seriesEjercicio.filter((s) => s.completada).length;
          return (
            <div
              key={nombre}
              className="rounded-2xl border border-hairline bg-surface px-3.5 py-3"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <p className="font-semibold text-ink">{nombre}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    completas === 4
                      ? "bg-surface-3 text-ink-faint"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {completas}/4
                </span>
              </div>

              {seriesEjercicio.map((serie) => {
                const previa = serie.ejercicio_id
                  ? previas.get(`${serie.ejercicio_id}-${serie.numero_serie}`)
                  : undefined;

                return activa ? (
                  <SetRow
                    key={serie.id}
                    entrenamientoId={id}
                    serieId={serie.id}
                    numeroSerie={serie.numero_serie}
                    pesoInicial={serie.peso_kg}
                    repsInicial={serie.repeticiones}
                    pesoPrevio={previa?.peso_kg ?? null}
                    repsPrevio={previa?.repeticiones ?? null}
                  />
                ) : (
                  <div key={serie.id} className="flex items-center gap-2 py-1">
                    <span className="w-3.5 text-[11px] tabular-nums text-ink-faint">
                      {serie.numero_serie}
                    </span>
                    <span className="text-sm text-ink">
                      {serie.peso_kg !== null
                        ? `${serie.peso_kg} kg × ${serie.repeticiones}`
                        : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {activa ? (
        <form action={terminarEntrenamiento.bind(null, id)} className="mt-5">
          <textarea
            name="comentario"
            placeholder="¿Cómo te sentiste? (opcional)"
            rows={3}
            className="mb-3 w-full rounded-xl border border-hairline bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white"
          >
            Terminar entrenamiento
          </button>
        </form>
      ) : entrenamiento.comentario ? (
        <div className="mt-5 rounded-2xl border border-hairline bg-surface p-4">
          <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
            Cómo te sentiste
          </p>
          <p className="text-sm text-ink">{entrenamiento.comentario}</p>
        </div>
      ) : null}
    </div>
  );
}
