// The steps really are a sequence, so they are numbered.
export function NextSteps({ title, steps }: { title: string; steps: readonly { heading: string; text: string }[] }) {
  return (
    <aside aria-label={title} className="rounded-2xl bg-primary p-6 text-primary-foreground">
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <ol className="mt-5 grid gap-5">
        {steps.map((s, i) => (
          <li key={s.heading} className="grid grid-cols-[1.75rem_1fr] gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-white/20 text-sm font-bold">{i + 1}</span>
            <div>
              <p className="font-semibold">{s.heading}</p>
              <p className="mt-0.5 text-sm text-primary-foreground/80">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
