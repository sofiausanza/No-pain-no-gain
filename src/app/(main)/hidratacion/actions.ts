"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { getUsuario } from "@/lib/usuario";
import { fechaArgentina } from "@/lib/fecha-argentina";

export async function agregarAgua(cantidad: number) {
  const usuario = await getUsuario();
  const fecha = fechaArgentina(new Date().toISOString());

  await supabase
    .from("registros_hidratacion")
    .insert({ user_id: usuario.id, fecha, cantidad_ml: cantidad });

  revalidatePath("/hidratacion");
  revalidatePath("/perfil");
}
