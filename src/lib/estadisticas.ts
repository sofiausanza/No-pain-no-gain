import { supabase } from "@/lib/supabase";
import { fechaArgentina, ahoraEnArgentina } from "@/lib/fecha-argentina";

export type Estadisticas = {
  totalEntrenamientos: number;
  diasEntrenadosEsteMes: number;
  duracionPromedioMin: number | null;
  rutinaMasEntrenada: string | null;
};

type FilaEntrenamiento = {
  iniciado_en: string;
  finalizado_en: string;
  rutina_nombre: string;
};

export async function getEstadisticas(userId: string): Promise<Estadisticas> {
  const { data } = await supabase
    .from("entrenamientos")
    .select("iniciado_en, finalizado_en, rutina_nombre")
    .eq("user_id", userId)
    .not("finalizado_en", "is", null)
    .returns<FilaEntrenamiento[]>();

  const filas = data ?? [];
  const totalEntrenamientos = filas.length;

  const ahoraArg = ahoraEnArgentina();
  const mesActual = `${ahoraArg.getFullYear()}-${String(
    ahoraArg.getMonth() + 1
  ).padStart(2, "0")}`;

  const diasEntrenadosEsteMes = new Set(
    filas
      .map((f) => fechaArgentina(f.iniciado_en))
      .filter((fecha) => fecha.startsWith(mesActual))
  ).size;

  const duracionPromedioMin =
    filas.length > 0
      ? Math.round(
          filas.reduce(
            (total, f) =>
              total +
              (new Date(f.finalizado_en).getTime() -
                new Date(f.iniciado_en).getTime()) /
                60000,
            0
          ) / filas.length
        )
      : null;

  const conteoPorRutina = new Map<string, number>();
  for (const f of filas) {
    conteoPorRutina.set(
      f.rutina_nombre,
      (conteoPorRutina.get(f.rutina_nombre) ?? 0) + 1
    );
  }

  let rutinaMasEntrenada: string | null = null;
  let max = 0;
  for (const [nombre, cantidad] of conteoPorRutina) {
    if (cantidad > max) {
      max = cantidad;
      rutinaMasEntrenada = nombre;
    }
  }

  return {
    totalEntrenamientos,
    diasEntrenadosEsteMes,
    duracionPromedioMin,
    rutinaMasEntrenada,
  };
}
