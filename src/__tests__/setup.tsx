/// <reference types="vitest/globals" />

import "@testing-library/jest-dom/vitest";

// Next.js Mocks

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/admin/disputes",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Library Mocks

vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return { ...actual };
});

vi.mock("sonner", () => ({
  toast: { custom: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("@/lib/loading-context", () => ({
  useLoading: () => ({
    setLoading: vi.fn(),
    setLoadingMessage: vi.fn(),
    isLoading: false,
  }),
  withLoading: vi.fn((_setLoading, _setMsg, fn: () => Promise<void>) => fn()),
}));

vi.mock("@/lib/admin-toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
  showInfo: vi.fn(),
  showLoadingToast: vi.fn(() => vi.fn()),
}));

// shadcn UI Component Mocks

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("@/components/ui/select", () => {
  // Module-level store for onValueChange handlers keyed by test-id index
  const handlers: Record<number, (v: string) => void> = {};
  let nextId = 0;

  return {
    Select: ({
      children,
      onValueChange,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
    }) => {
      const id = nextId++;
      if (onValueChange) handlers[id] = onValueChange;
      return (
        <div data-testid="mock-select" data-select-id={id}>
          {children}
        </div>
      );
    },
    SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <button className={className} data-testid="select-trigger">
        {children}
      </button>
    ),
    SelectValue: ({ placeholder }: { placeholder?: string }) => (
      <span data-testid="select-value">{placeholder}</span>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-content">{children}</div>
    ),
    SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <button
        data-testid="select-item"
        data-value={value}
        onClick={() => {
          // Find the parent select-id and call its handler
          // We walk up because React batches renders; use closest approach
          const btn = document.querySelector(`[data-testid="select-item"][data-value="${value}"]`);
          if (!btn) return;
          const selectEl = btn.closest("[data-testid='mock-select']");
          if (!selectEl) return;
          const selectId = Number(selectEl.getAttribute("data-select-id"));
          handlers[selectId]?.(value);
        }}
      >
        {children}
      </button>
    ),
  };
});

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="alert-dialog-content" className={className}>
      {children}
    </div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  AlertDialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h2 className={className}>{children}</h2>,
  AlertDialogDescription: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <p className={className}>{children}</p>,
  AlertDialogAction: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid="alert-dialog-action">
      {children}
    </button>
  ),
  AlertDialogCancel: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button className={className} data-testid="alert-dialog-cancel">
      {children}
    </button>
  ),
}));

vi.mock("@/components/layout/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar" />,
}));
