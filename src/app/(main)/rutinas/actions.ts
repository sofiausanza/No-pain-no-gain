"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUsuario } from "@/lib/usuario";

export async function crearRutina(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return;

  const usuario = await getUsuario();
  const { count } = await supabase
    .from("rutinas")
    .select("id", { count: "exact", head: true })
    .eq("user_id", usuario.id);

  const { data, error } = await supabase
    .from("rutinas")
    .insert({ user_id: usuario.id, nombre, orden: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) return;

  revalidatePath("/rutinas");
  redirect(`/rutinas/${data.id}`);
}

export async function renombrarRutina(id: string, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return;

  await supabase.from("rutinas").update({ nombre }).eq("id", id);
  revalidatePath(`/rutinas/${id}`);
  revalidatePath("/rutinas");
}

export async function eliminarRutina(id: string) {
  await supabase.from("rutinas").delete().eq("id", id);
  revalidatePath("/rutinas");
  redirect("/rutinas");
}

export async function crearEjercicio(rutinaId: string, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return;

  const usuario = await getUsuario();
  const { count } = await supabase
    .from("ejercicios")
    .select("id", { count: "exact", head: true })
    .eq("rutina_id", rutinaId);

  await supabase.from("ejercicios").insert({
    rutina_id: rutinaId,
    user_id: usuario.id,
    nombre,
    orden: count ?? 0,
  });

  revalidatePath(`/rutinas/${rutinaId}`);
}

export async function eliminarEjercicio(rutinaId: string, ejercicioId: string) {
  await supabase.from("ejercicios").delete().eq("id", ejercicioId);
  revalidatePath(`/rutinas/${rutinaId}`);
}
