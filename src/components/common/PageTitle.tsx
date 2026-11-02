export function PageTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-7 max-w-2xl">
      <h1 className="font-display text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-base text-muted">{hint}</p>
    </div>
  );
}
