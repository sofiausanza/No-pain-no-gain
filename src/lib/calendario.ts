export function nombreMes(year: number, month: number) {
  const texto = new Date(year, month, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function diasDelMes(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Semana empieza en lunes: lunes=0 ... domingo=6
export function primerDiaSemana(year: number, month: number) {
  const dia = new Date(year, month, 1).getDay();
  return (dia + 6) % 7;
}
