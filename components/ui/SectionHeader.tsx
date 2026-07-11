export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm tracking-wide text-muted">
      <span className="text-accent">// </span>
      {children}
    </h2>
  );
}
