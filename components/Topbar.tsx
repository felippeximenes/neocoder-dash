export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-8">
      <div className="font-display text-2xl font-extrabold tracking-tight text-text-primary">
        NEOCODER<span className="bg-gradient-to-r from-brand-purple to-purple-300 bg-clip-text text-transparent">.DASH</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#2ee6c8]" />
        Dados em tempo real
      </div>
    </header>
  );
}
