import { SubTopBar } from "@/components/sub-top-bar";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";
import { iniciarEntrenamiento } from "../actions";

export const metadata = { title: "Elegir rutina" };
export const dynamic = "force-dynamic";

type Rutina = {
  id: string;
  nombre: string;
  ejercicios: { count: number }[];
};

export default async function ElegirRutinaPage() {
  const usuario = await getUsuario();
  const { data: rutinas } = await supabase
    .from("rutinas")
    .select("id, nombre, ejercicios(count)")
    .eq("user_id", usuario.id)
    .order("orden", { ascending: true })
    .returns<Rutina[]>();

  return (
    <div>
      <SubTopBar title="¿Qué rutina hacés?" backHref="/entrenamiento" />

      {!rutinas || rutinas.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Todavía no tenés rutinas. Creá una primero en la sección Rutinas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rutinas.map((rutina) => (
            <form
              key={rutina.id}
              action={iniciarEntrenamiento.bind(null, rutina.id)}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5 text-left"
              >
                <div>
                  <p className="font-semibold text-ink">{rutina.nombre}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {rutina.ejercicios[0]?.count ?? 0} ejercicios
                  </p>
                </div>
                <span className="text-accent">›</span>
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
