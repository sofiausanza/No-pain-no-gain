import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { ConfirmButton } from "@/components/confirm-button";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";
import { formatearFecha, formatearDuracion } from "@/lib/formato";
import { descartarEntrenamiento } from "./actions";

export const metadata = { title: "Entrenamiento" };
export const dynamic = "force-dynamic";

type EntrenamientoActivo = {
  id: string;
  rutina_nombre: string;
};

type EntrenamientoHistorial = {
  id: string;
  rutina_nombre: string;
  iniciado_en: string;
  finalizado_en: string;
};

export default async function EntrenamientoPage() {
  const usuario = await getUsuario();

  const { data: activo } = await supabase
    .from("entrenamientos")
    .select("id, rutina_nombre")
    .eq("user_id", usuario.id)
    .is("finalizado_en", null)
    .order("iniciado_en", { ascending: false })
    .limit(1)
    .maybeSingle<EntrenamientoActivo>();

  const { data: historial } = await supabase
    .from("entrenamientos")
    .select("id, rutina_nombre, iniciado_en, finalizado_en")
    .eq("user_id", usuario.id)
    .not("finalizado_en", "is", null)
    .order("iniciado_en", { ascending: false })
    .limit(20)
    .returns<EntrenamientoHistorial[]>();

  return (
    <div>
      <TopBar title="Entrenamiento" avatarLetter={usuario.nombre[0]} />

      {activo ? (
        <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-5">
          <p className="text-sm text-ink">
            Tenés un entrenamiento sin terminar:{" "}
            <span className="font-semibold">{activo.rutina_nombre}</span>
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/entrenamiento/${activo.id}`}
              className="flex-1 rounded-xl bg-accent py-2.5 text-center text-sm font-bold text-white"
            >
              Retomar
            </Link>
            <form action={descartarEntrenamiento.bind(null, activo.id)}>
              <ConfirmButton
                message="¿Descartar este entrenamiento sin terminar? Se borran las series cargadas."
                className="rounded-xl border border-hairline px-4 py-2.5 text-sm font-semibold text-ink-soft"
              >
                Descartar
              </ConfirmButton>
            </form>
          </div>
        </div>
      ) : (
        <Link
          href="/entrenamiento/elegir"
          className="mb-6 flex items-center justify-center rounded-2xl bg-accent py-4 text-center font-display text-base font-bold text-white"
        >
          Comenzar entrenamiento
        </Link>
      )}

      <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
        Historial
      </p>

      {!historial || historial.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Todavía no completaste ningún entrenamiento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {historial.map((sesion) => (
            <Link
              key={sesion.id}
              href={`/entrenamiento/${sesion.id}`}
              className="flex items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5"
            >
              <div>
                <p className="font-semibold text-ink">{sesion.rutina_nombre}</p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {formatearFecha(sesion.iniciado_en)} ·{" "}
                  {formatearDuracion(sesion.iniciado_en, sesion.finalizado_en)}
                </p>
              </div>
              <span className="text-ink-faint">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
