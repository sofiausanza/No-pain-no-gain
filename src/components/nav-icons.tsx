export function IconRutinas() {
  return (
    <div className="flex h-5 w-[18px] flex-col justify-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-[3px]">
          <span className="h-1 w-1 shrink-0 rounded-[1px] border-[1.3px] border-current" />
          <span className="h-[1.4px] flex-1 rounded-full bg-current" />
        </span>
      ))}
    </div>
  );
}

export function IconEntrenamiento() {
  return (
    <div className="flex h-5 w-[22px] items-center gap-px">
      <span className="h-2 w-[3px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-[14px] w-[3px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-[2px] flex-1 rounded-[1px] bg-current" />
      <span className="h-[14px] w-[3px] shrink-0 rounded-[1px] bg-current" />
      <span className="h-2 w-[3px] shrink-0 rounded-[1px] bg-current" />
    </div>
  );
}

export function IconCalendario() {
  return (
    <div className="relative mx-auto mt-1 h-4 w-[18px] rounded-[3px] border-[1.6px] border-current">
      <span className="absolute inset-x-0 top-0 h-1 border-b-[1.6px] border-current" />
      <span className="absolute -top-[5px] left-1 h-[5px] w-[1.6px] bg-current" />
      <span className="absolute -top-[5px] left-[9px] h-[5px] w-[1.6px] bg-current" />
    </div>
  );
}

export function IconHidratacion() {
  return (
    <div className="mx-auto mt-1.5 h-[13px] w-[13px] rotate-45 rounded-[50%_50%_50%_0] bg-current" />
  );
}
