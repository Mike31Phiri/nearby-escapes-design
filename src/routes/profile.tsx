import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const sid = localStorage.getItem("ne.session");
    if (!sid) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: ProfileLayout,
});

function ProfileLayout() {
  return <Outlet />;
}
