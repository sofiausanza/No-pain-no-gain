"use client";

import { useEffect, useState } from "react";

function calcularSegundos(iniciadoEn: string) {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iniciadoEn).getTime()) / 1000)
  );
}

function formatear(segundos: number) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function Timer({ iniciadoEn }: { iniciadoEn: string }) {
  const [segundos, setSegundos] = useState(() => calcularSegundos(iniciadoEn));

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos(calcularSegundos(iniciadoEn));
    }, 1000);
    return () => clearInterval(id);
  }, [iniciadoEn]);

  return (
    <div className="font-display text-4xl font-extrabold tabular-nums text-ink">
      {formatear(segundos)}
    </div>
  );
}
