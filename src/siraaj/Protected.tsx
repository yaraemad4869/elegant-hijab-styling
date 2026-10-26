import { useEffect, type ReactNode } from "react";
import { useApp } from "./context";
import { useNavigate } from "./router-compat";

/** يحمي الصفحات التي تتطلب تسجيل دخول (وربما دورًا معيّنًا). */
export function Protected({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const allowed = !!currentUser && (!roles || roles.includes(currentUser.role));

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    } else if (roles && !roles.includes(currentUser.role)) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
