import { TopBar } from "@/components/top-bar";
import { getUsuario } from "@/lib/usuario";
import { getEstadisticas } from "@/lib/estadisticas";
import { EditableField } from "./editable-field";
import { actualizarAltura, actualizarPeso, actualizarObjetivoAgua } from "./actions";

export const metadata = { title: "Perfil" };
export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <div className="rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink">
        {value}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface px-3.5 py-3">
      <p className="font-display text-lg font-extrabold tabular-nums text-accent">
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink-faint">{label}</p>
    </div>
  );
}

export default async function PerfilPage() {
  const usuario = await getUsuario();
  const stats = await getEstadisticas(usuario.id);

  return (
    <div>
      <TopBar title="Perfil" />

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-2xl font-extrabold text-accent">
        {usuario.nombre[0]}
      </div>

      <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
        Tus números
      </p>
      <div className="mb-6 grid grid-cols-2 gap-2.5">
        <Stat label="Días entrenados este mes" value={String(stats.diasEntrenadosEsteMes)} />
        <Stat
          label="Duración promedio"
          value={
            stats.duracionPromedioMin !== null
              ? `${stats.duracionPromedioMin} min`
              : "—"
          }
        />
        <Stat
          label="Promedio de agua"
          value={stats.promedioAguaMl !== null ? `${stats.promedioAguaMl} ml` : "—"}
        />
        <Stat label="Rutina más entrenada" value={stats.rutinaMasEntrenada ?? "—"} />
      </div>

      <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-ink-faint">
        Tus datos
      </p>
      <Field label="Nombre" value={usuario.nombre} />
      <EditableField
        label="Altura"
        initialValue={usuario.altura_cm}
        suffix="cm"
        guardar={actualizarAltura.bind(null, usuario.id)}
      />
      <EditableField
        label="Peso"
        initialValue={usuario.peso_kg}
        suffix="kg"
        guardar={actualizarPeso.bind(null, usuario.id)}
      />
      <EditableField
        label="Objetivo diario de agua"
        initialValue={usuario.objetivo_agua_ml}
        suffix="ml"
        guardar={actualizarObjetivoAgua.bind(null, usuario.id)}
      />
    </div>
  );
}
