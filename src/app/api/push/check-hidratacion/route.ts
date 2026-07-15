import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUsuario } from "@/lib/usuario";
import { fechaArgentina, ahoraEnArgentina } from "@/lib/fecha-argentina";
import { webpush } from "@/lib/push-server";

// Se espera que tomes agua a un ritmo parejo entre estas horas.
// Fuera de este rango no molesta con avisos.
const HORA_INICIO = 8;
const HORA_FIN = 22;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const usuario = await getUsuario();
  const hoy = fechaArgentina(new Date().toISOString());
  const horaActual = ahoraEnArgentina().getHours();

  if (horaActual < HORA_INICIO || horaActual >= HORA_FIN) {
    return NextResponse.json({ skipped: "fuera de horario" });
  }

  const { data: registros } = await supabase
    .from("registros_hidratacion")
    .select("cantidad_ml")
    .eq("user_id", usuario.id)
    .eq("fecha", hoy);

  const totalHoy = (registros ?? []).reduce(
    (suma, r) => suma + r.cantidad_ml,
    0
  );
  const objetivo = usuario.objetivo_agua_ml;

  const progresoEsperado = (horaActual - HORA_INICIO) / (HORA_FIN - HORA_INICIO);
  const objetivoEsperadoAhora = objetivo * progresoEsperado;

  if (totalHoy >= objetivoEsperadoAhora || totalHoy >= objetivo) {
    return NextResponse.json({ skipped: "vas al día" });
  }

  const { data: suscripciones } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", usuario.id);

  if (!suscripciones || suscripciones.length === 0) {
    return NextResponse.json({ skipped: "sin suscripciones" });
  }

  const payload = JSON.stringify({
    title: "No Pain No Gain",
    body: `Llevás ${totalHoy} ml de ${objetivo} ml hoy. Tomá un poco de agua 💧`,
  });

  const resultados = await Promise.allSettled(
    suscripciones.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      )
    )
  );

  await Promise.all(
    resultados.map((resultado, i) => {
      const codigo = (resultado as PromiseRejectedResult)?.reason?.statusCode;
      if (resultado.status === "rejected" && (codigo === 404 || codigo === 410)) {
        return supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", suscripciones[i].endpoint);
      }
      return Promise.resolve();
    })
  );

  return NextResponse.json({ enviadas: resultados.length });
}
