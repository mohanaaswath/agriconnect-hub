export function Statistics() {
  const stats = [
    { value: "40+", label: "Years of farming" },
    { value: "500+", label: "Happy customers" },
    { value: "120+", label: "Native livestock sold" },
    { value: "300+", label: "Acres handled" },
  ];
  return (
    <section className="py-16 border-y border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl md:text-5xl font-bold gold-text">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
