"use client";

import { useState } from "react";
import { guardarSerie } from "../actions";

export function SetRow({
  entrenamientoId,
  serieId,
  numeroSerie,
  pesoInicial,
  repsInicial,
  pesoPrevio,
  repsPrevio,
}: {
  entrenamientoId: string;
  serieId: string;
  numeroSerie: number;
  pesoInicial: number | null;
  repsInicial: number | null;
  pesoPrevio: number | null;
  repsPrevio: number | null;
}) {
  const [peso, setPeso] = useState<number | "">(pesoInicial ?? pesoPrevio ?? "");
  const [reps, setReps] = useState<number | "">(repsInicial ?? "");

  const guardar = () => {
    guardarSerie(
      serieId,
      entrenamientoId,
      peso === "" ? null : peso,
      reps === "" ? null : reps
    );
  };

  const completada = peso !== "" && reps !== "";

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="mt-2.5 w-3.5 text-[11px] tabular-nums text-ink-faint">
        {numeroSerie}
      </span>
      <div className="flex-1 rounded-lg border border-hairline bg-surface-2 px-2.5 py-2">
        <div className="flex items-center gap-1.5 text-sm">
          <input
            type="number"
            inputMode="decimal"
            placeholder="kg"
            value={peso}
            onChange={(e) =>
              setPeso(e.target.value === "" ? "" : Number(e.target.value))
            }
            onBlur={guardar}
            className="w-14 bg-transparent font-bold tabular-nums text-ink placeholder:font-normal placeholder:text-ink-faint focus:outline-none"
          />
          <span className="text-ink-faint">kg ×</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="reps"
            value={reps}
            onChange={(e) =>
              setReps(e.target.value === "" ? "" : Number(e.target.value))
            }
            onBlur={guardar}
            className="w-14 bg-transparent font-bold tabular-nums text-ink placeholder:font-normal placeholder:text-ink-faint focus:outline-none"
          />
        </div>
        {pesoPrevio !== null && (
          <p className="mt-0.5 text-[9.5px] text-ink-faint">
            la vez pasada: {pesoPrevio} kg × {repsPrevio}
          </p>
        )}
      </div>
      <div
        className={`mt-1.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border ${
          completada ? "border-accent bg-accent" : "border-hairline"
        }`}
      >
        {completada && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
