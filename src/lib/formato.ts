export function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

export function formatearDuracion(inicioIso: string, finIso: string) {
  const minutos = Math.max(
    0,
    Math.round(
      (new Date(finIso).getTime() - new Date(inicioIso).getTime()) / 60000
    )
  );
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return horas > 0 ? `${horas} h ${resto} min` : `${resto} min`;
}
