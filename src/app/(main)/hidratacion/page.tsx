import { TopBar } from "@/components/top-bar";

export const metadata = { title: "Hidratación" };
export const dynamic = "force-dynamic";

export default function HidratacionPage() {
  return (
    <div>
      <TopBar title="Hidratación" />
      <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
        <p className="text-sm text-ink-soft">
          Acá va a estar el registro de agua del día. Todavía en construcción.
        </p>
      </div>
    </div>
  );
}
