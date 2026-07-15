import { supabase } from "@/lib/supabase";

export type SeriePrevia = {
  peso_kg: number | null;
  repeticiones: number | null;
};

type FilaPrevia = {
  ejercicio_id: string;
  numero_serie: number;
  peso_kg: number | null;
  repeticiones: number | null;
  entrenamientos: { iniciado_en: string } | null;
};

// Para cada (ejercicio, número de serie), busca el último peso/reps
// cargado en una sesión anterior (excluyendo la sesión actual), para
// precargar el campo y mostrar el texto "la vez pasada: X kg × Y".
export async function getSeriesPrevias(
  ejercicioIds: string[],
  entrenamientoIdExcluir: string
): Promise<Map<string, SeriePrevia>> {
  const previas = new Map<string, SeriePrevia>();
  if (ejercicioIds.length === 0) return previas;

  const { data } = await supabase
    .from("series_entrenamiento")
    .select(
      "ejercicio_id, numero_serie, peso_kg, repeticiones, entrenamientos!inner(iniciado_en)"
    )
    .in("ejercicio_id", ejercicioIds)
    .neq("entrenamiento_id", entrenamientoIdExcluir)
    .not("peso_kg", "is", null)
    .order("iniciado_en", { referencedTable: "entrenamientos", ascending: false })
    .returns<FilaPrevia[]>();

  for (const fila of data ?? []) {
    const key = `${fila.ejercicio_id}-${fila.numero_serie}`;
    if (!previas.has(key)) {
      previas.set(key, {
        peso_kg: fila.peso_kg,
        repeticiones: fila.repeticiones,
      });
    }
  }

  return previas;
}
