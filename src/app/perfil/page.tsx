import Link from "next/link";
import { getUsuario } from "@/lib/usuario";

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

export default async function PerfilPage() {
  const usuario = await getUsuario();

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Perfil
        </h1>
        <Link
          href="/rutinas"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-sm text-accent"
        >
          ←
        </Link>
      </div>

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-2xl font-extrabold text-accent">
        {usuario.nombre[0]}
      </div>

      <Field label="Nombre" value={usuario.nombre} />
      <Field
        label="Altura"
        value={usuario.altura_cm ? `${usuario.altura_cm} cm` : "Sin definir"}
      />
      <Field
        label="Peso"
        value={usuario.peso_kg ? `${usuario.peso_kg} kg` : "Sin definir"}
      />
      <Field
        label="Objetivo diario de agua"
        value={`${usuario.objetivo_agua_ml} ml`}
      />
    </div>
  );
}
