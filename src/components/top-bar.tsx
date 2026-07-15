import Link from "next/link";

export function TopBar({
  title,
  avatarLetter,
}: {
  title: string;
  avatarLetter: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
      <Link
        href="/perfil"
        className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-accent bg-accent/10 text-[13px] font-extrabold text-accent"
      >
        {avatarLetter}
      </Link>
    </div>
  );
}
