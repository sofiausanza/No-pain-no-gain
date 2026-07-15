import { supabase } from "@/lib/supabase";

export type Usuario = {
  id: string;
  nombre: string;
  altura_cm: number | null;
  peso_kg: number | null;
  objetivo_agua_ml: number;
  created_at: string;
};

// Todavía no hay login: la app siempre trabaja con el primer usuario
// creado. El día que agreguemos autenticación, esto se reemplaza por
// el usuario autenticado sin tocar el resto de la app.
export async function getUsuario(): Promise<Usuario> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}
