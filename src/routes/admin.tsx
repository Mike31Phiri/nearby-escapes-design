import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const sid = localStorage.getItem("ne.session");
    const userRole = localStorage.getItem("ne.userRole");
    if (!sid || userRole !== "admin") {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
