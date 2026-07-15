"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function actualizarPeso(usuarioId: string, peso: number | null) {
  await supabase.from("usuarios").update({ peso_kg: peso }).eq("id", usuarioId);
  revalidatePath("/perfil");
}

export async function actualizarObjetivoAgua(
  usuarioId: string,
  ml: number | null
) {
  await supabase
    .from("usuarios")
    .update({ objetivo_agua_ml: ml ?? 2000 })
    .eq("id", usuarioId);

  revalidatePath("/perfil");
  revalidatePath("/hidratacion");
}
