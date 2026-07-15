import { TopBar } from "@/components/top-bar";
import { NotificacionesAgua } from "@/components/notificaciones-agua";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";
import { fechaArgentina } from "@/lib/fecha-argentina";
import { agregarAgua } from "./actions";

export const metadata = { title: "Hidratación" };
export const dynamic = "force-dynamic";

type Registro = {
  fecha: string;
  cantidad_ml: number;
};

function formatearFechaCorta(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

function formatearFechaLarga(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  const texto = new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default async function HidratacionPage() {
  const usuario = await getUsuario();
  const hoy = fechaArgentina(new Date().toISOString());

  const { data: registros } = await supabase
    .from("registros_hidratacion")
    .select("fecha, cantidad_ml")
    .eq("user_id", usuario.id)
    .returns<Registro[]>();

  const totalPorDia = new Map<string, number>();
  for (const r of registros ?? []) {
    totalPorDia.set(r.fecha, (totalPorDia.get(r.fecha) ?? 0) + r.cantidad_ml);
  }

  const totalHoy = totalPorDia.get(hoy) ?? 0;
  const objetivo = usuario.objetivo_agua_ml;
  const porcentaje = Math.min(100, Math.round((totalHoy / objetivo) * 100));

  const historial = Array.from(totalPorDia.entries())
    .filter(([fecha]) => fecha !== hoy)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 10);

  return (
    <div>
      <TopBar title="Hidratación" />
      <p className="-mt-3 mb-4 text-xs text-ink-faint">{formatearFechaLarga(hoy)}</p>

      <div className="mb-2 text-center">
        <p className="font-display text-4xl font-extrabold tabular-nums text-white">
          {totalHoy} ml
        </p>
        <p className="text-xs text-ink-faint">de tu objetivo de {objetivo} ml</p>
      </div>

      <div className="mb-5 h-3 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="mb-6 flex gap-2.5">
        <form action={agregarAgua.bind(null, 250)} className="flex-1">
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white"
          >
            +250 ml
          </button>
        </form>
        <form action={agregarAgua.bind(null, 500)} className="flex-1">
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white"
          >
            +500 ml
          </button>
        </form>
      </div>

      <NotificacionesAgua userId={usuario.id} />

      <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
        Historial
      </p>

      {historial.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
          <p className="text-sm text-ink-soft">
            Todavía no hay más días registrados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {historial.map(([fecha, total]) => (
            <div
              key={fecha}
              className="flex items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-2.5"
            >
              <span className="text-sm text-ink-soft">
                {formatearFechaCorta(fecha)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {total} ml
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
