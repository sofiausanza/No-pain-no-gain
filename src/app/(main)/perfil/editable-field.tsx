"use client";

import { useState } from "react";

export function EditableField({
  label,
  initialValue,
  suffix,
  guardar,
}: {
  label: string;
  initialValue: number | null;
  suffix: string;
  guardar: (valor: number | null) => void;
}) {
  const [valor, setValor] = useState<number | "">(initialValue ?? "");

  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <div className="flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 py-2.5">
        <input
          type="number"
          inputMode="decimal"
          value={valor}
          onChange={(e) =>
            setValor(e.target.value === "" ? "" : Number(e.target.value))
          }
          onBlur={() => guardar(valor === "" ? null : valor)}
          className="w-20 bg-transparent text-sm font-semibold tabular-nums text-ink focus:outline-none"
        />
        <span className="text-sm text-ink-faint">{suffix}</span>
      </div>
    </div>
  );
}
