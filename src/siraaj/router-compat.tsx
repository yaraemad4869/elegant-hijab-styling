// طبقة توافق صغيرة: تحوّل واجهة react-router-dom المستخدمة في الصفحات
// إلى TanStack Router المستخدم في هذه المنصة.
import {
  Link as TanStackLink,
  useNavigate as useTanStackNavigate,
  useRouterState,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NavigateOptions = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const navigate = useTanStackNavigate();
  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") window.history.go(to);
      return;
    }
    void navigate({ to, replace: options?.replace });
  };
}

export function useLocation() {
  return useRouterState({ select: (s) => s.location });
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  children?: ReactNode;
};

export function Link({ to, replace, children, ...rest }: LinkProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TanStackLink to={to as any} replace={replace} {...rest}>
      {children}
    </TanStackLink>
  );
}
