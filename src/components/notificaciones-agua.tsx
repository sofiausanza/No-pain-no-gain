"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Estado = "cargando" | "activo" | "inactivo" | "no-soportado";

function soportado() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function NotificacionesAgua({ userId }: { userId: string }) {
  const [estado, setEstado] = useState<Estado>(() =>
    soportado() ? "cargando" : "no-soportado"
  );

  useEffect(() => {
    if (!soportado()) return;

    navigator.serviceWorker.ready.then(async (registration) => {
      const sub = await registration.pushManager.getSubscription();
      setEstado(sub ? "activo" : "inactivo");
    });
  }, []);

  async function activar() {
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, userId }),
    });

    setEstado("activo");
  }

  async function desactivar() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }

    setEstado("inactivo");
  }

  if (estado === "no-soportado" || estado === "cargando") return null;

  return (
    <button
      onClick={estado === "activo" ? desactivar : activar}
      className={`mb-6 w-full rounded-xl border py-2.5 text-xs font-semibold ${
        estado === "activo"
          ? "border-hairline text-ink-soft"
          : "border-accent text-accent"
      }`}
    >
      {estado === "activo"
        ? "Recordatorios de agua activados · Desactivar"
        : "Activar recordatorios de agua"}
    </button>
  );
}
