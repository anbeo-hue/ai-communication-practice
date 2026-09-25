export function ModeBadge({ mode }: { mode: "script" | "natural" }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] ${
        mode === "script"
          ? "bg-script text-script-foreground"
          : "bg-natural text-natural-foreground"
      }`}
    >
      {mode === "script" ? "SCRIPT MODE" : "NATURAL MODE"}
    </span>
  );
}
