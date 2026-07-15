"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUsuario } from "@/lib/usuario";

export async function iniciarEntrenamiento(rutinaId: string) {
  const usuario = await getUsuario();

  const { data: rutina } = await supabase
    .from("rutinas")
    .select("nombre")
    .eq("id", rutinaId)
    .single();

  if (!rutina) return;

  const { data: ejercicios } = await supabase
    .from("ejercicios")
    .select("id, nombre")
    .eq("rutina_id", rutinaId)
    .order("orden", { ascending: true });

  const { data: entrenamiento, error } = await supabase
    .from("entrenamientos")
    .insert({
      user_id: usuario.id,
      rutina_id: rutinaId,
      rutina_nombre: rutina.nombre,
    })
    .select("id")
    .single();

  if (error || !entrenamiento) return;

  const filas = (ejercicios ?? []).flatMap((ejercicio) =>
    [1, 2, 3, 4].map((numero_serie) => ({
      entrenamiento_id: entrenamiento.id,
      ejercicio_id: ejercicio.id,
      ejercicio_nombre: ejercicio.nombre,
      numero_serie,
    }))
  );

  if (filas.length > 0) {
    await supabase.from("series_entrenamiento").insert(filas);
  }

  revalidatePath("/entrenamiento");
  redirect(`/entrenamiento/${entrenamiento.id}`);
}

export async function descartarEntrenamiento(id: string) {
  await supabase.from("entrenamientos").delete().eq("id", id);
  revalidatePath("/entrenamiento");
}

export async function guardarSerie(
  serieId: string,
  entrenamientoId: string,
  peso: number | null,
  repeticiones: number | null
) {
  await supabase
    .from("series_entrenamiento")
    .update({
      peso_kg: peso,
      repeticiones,
      completada: peso !== null && repeticiones !== null,
    })
    .eq("id", serieId);

  revalidatePath(`/entrenamiento/${entrenamientoId}`);
}

export async function terminarEntrenamiento(id: string, formData: FormData) {
  const comentario = (formData.get("comentario") as string)?.trim() || null;

  await supabase
    .from("entrenamientos")
    .update({ finalizado_en: new Date().toISOString(), comentario })
    .eq("id", id);

  revalidatePath("/entrenamiento");
  revalidatePath(`/entrenamiento/${id}`);
  redirect("/entrenamiento");
}
