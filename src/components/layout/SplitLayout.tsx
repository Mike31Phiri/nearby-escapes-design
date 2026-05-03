export function SplitLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">{children}</div>;
}
