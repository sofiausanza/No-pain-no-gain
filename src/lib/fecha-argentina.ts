export const ZONA_ARGENTINA = "America/Argentina/Buenos_Aires";

// Fecha (YYYY-MM-DD) de un timestamp, en huso horario argentino.
export function fechaArgentina(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: ZONA_ARGENTINA,
  });
}

// "Ahora" como Date, ajustado a huso horario argentino.
export function ahoraEnArgentina(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: ZONA_ARGENTINA })
  );
}
