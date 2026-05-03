export function PageWrapper({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-7xl px-4 md:px-6">{children}</main>;
}
