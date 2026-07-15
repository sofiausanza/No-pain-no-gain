import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";
import { supabase } from "@/lib/supabase";
import { nombreMes, diasDelMes, primerDiaSemana } from "@/lib/calendario";

export const metadata = { title: "Calendario" };
export const dynamic = "force-dynamic";

const DIAS_SEMANA = ["L", "M", "M", "J", "V", "S", "D"];
const ZONA = "America/Argentina/Buenos_Aires";

function fechaLocal(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: ZONA });
}

function paramMes(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const usuario = await getUsuario();
  const { mes } = await searchParams;

  const hoyArg = new Date(new Date().toLocaleString("en-US", { timeZone: ZONA }));
  let year = hoyArg.getFullYear();
  let month = hoyArg.getMonth();

  if (mes && /^\d{4}-\d{2}$/.test(mes)) {
    const [y, m] = mes.split("-").map(Number);
    year = y;
    month = m - 1;
  }

  const { data: entrenamientos } = await supabase
    .from("entrenamientos")
    .select("iniciado_en")
    .eq("user_id", usuario.id)
    .not("finalizado_en", "is", null);

  const diasEntrenados = new Set(
    (entrenamientos ?? []).map((e) => fechaLocal(e.iniciado_en))
  );

  const totalDias = diasDelMes(year, month);
  const primerDia = primerDiaSemana(year, month);
  const hoyStr = fechaLocal(new Date().toISOString());

  const celdas: (number | null)[] = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  let contador = 0;
  for (let d = 1; d <= totalDias; d++) {
    const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (diasEntrenados.has(fecha)) contador++;
  }

  return (
    <div>
      <TopBar title="Calendario" avatarLetter={usuario.nombre[0]} />

      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/calendario?mes=${paramMes(new Date(year, month - 1, 1))}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-ink-soft"
        >
          ‹
        </Link>
        <p className="font-display text-sm font-bold text-ink">
          {nombreMes(year, month)}
        </p>
        <Link
          href={`/calendario?mes=${paramMes(new Date(year, month + 1, 1))}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-ink-soft"
        >
          ›
        </Link>
      </div>

      <div className="mb-4 rounded-2xl border border-accent/35 bg-accent/10 px-4 py-2.5 text-sm text-ink">
        <span className="font-display text-base font-extrabold tabular-nums text-accent">
          {contador}
        </span>{" "}
        {contador === 1 ? "día entrenado" : "días entrenados"} este mes
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="pb-1 text-[10px] font-bold text-ink-faint">
            {d}
          </div>
        ))}
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={i} />;
          const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          const entrenado = diasEntrenados.has(fecha);
          const esHoy = fecha === hoyStr;
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs tabular-nums ${
                entrenado
                  ? "bg-accent font-bold text-white"
                  : esHoy
                    ? "border border-accent text-accent"
                    : "text-ink-soft"
              }`}
            >
              {dia}
            </div>
          );
        })}
      </div>
    </div>
  );
}
