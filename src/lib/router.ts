// Next.js router compatibility layer for TanStack Router migration
import { useRouter as useNextRouter } from 'next/navigation';

export function useParams<T = Record<string, string | string[]>>() {
  const params = useNextRouter().params;
  return params as T;
}

export function useNavigate() {
  const router = useNextRouter();
  
  return {
    navigate: (options: { to: string; params?: Record<string, string>; search?: Record<string, string> }) => {
      let path = options.to;
      
      // Replace dynamic params like $id with actual values
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          path = path.replace(`$${key}`, String(value));
        });
      }
      
      // Add search params if provided
      if (options.search) {
        const searchParams = new URLSearchParams(options.search);
        path += `?${searchParams.toString()}`;
      }
      
      router.push(path);
    },
  };
}

export function useLocation() {
  const router = useNextRouter();
  const pathname = router.pathname;
  const search = router.search;
  
  return {
    pathname,
    search,
    href: pathname + search,
  };
}

export function Link({ to, params, children, className, ...props }: {
  to: string;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const href = typeof to === 'string' 
    ? to.replace(/\$(\w+)/g, (_, key) => params?.[key] || '')
    : '/';
  
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

export function useSearch<T = Record<string, string>>() {
  const router = useNextRouter();
  const searchParams = new URLSearchParams(router.search);
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result as T;
}
