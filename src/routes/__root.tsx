import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    lazyRouteComponent,
    createRootRouteWithContext,
    useRouterState,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppProvider, useApp } from "../siraaj/context";
import Navbar from "../siraaj/components/Navbar";
import Footer from "../siraaj/components/Footer";
import WhatsAppButton from "../siraaj/components/WhatsAppButton";

const NotFoundComponent = lazyRouteComponent(
    () => import("./root-components"),
    "RootNotFoundComponent",
);
const ErrorComponent = lazyRouteComponent(
    () => import("./root-components"),
    "RootErrorComponent",
);


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "سِراج | تعليم القرآن والعلوم الشرعية أونلاين" },
            {
                name: "description",
                content:
                    "احجز حلقاتك مع معلمي سِراج لتعليم القرآن الكريم والتجويد والعلوم الشرعية، بباقات مرنة تناسب الأطفال والكبار.",
            },
            { property: "og:title", content: "سِراج | تعليم القرآن والعلوم الشرعية أونلاين" },
            {
                property: "og:description",
                content: "احجز حلقاتك مع معلمي سِراج لتعليم القرآن الكريم والتجويد والعلوم الشرعية، بباقات مرنة تناسب الأطفال والكبار.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:site", content: "@Lovable" },
            { name: "twitter:title", content: "سِراج | تعليم القرآن والعلوم الشرعية أونلاين" },
            { name: "twitter:description", content: "احجز حلقاتك مع معلمي سِراج لتعليم القرآن الكريم والتجويد والعلوم الشرعية، بباقات مرنة تناسب الأطفال والكبار." },
            { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ab7625d-9039-4b80-94b8-70f78153ca5b/id-preview-5d5c6bb5--b4b7f247-004e-4bc0-9e9c-be32f2d3cbf2.lovable.app-1785248824243.png" },
            { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7ab7625d-9039-4b80-94b8-70f78153ca5b/id-preview-5d5c6bb5--b4b7f247-004e-4bc0-9e9c-be32f2d3cbf2.lovable.app-1785248824243.png" },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
            { rel: "icon", type: "image/png", href: "/favicon.png" },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@300;400;500;600;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap",
            },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
            </body>
        </html>
    );
}

function SiteLayout() {
    const { dir } = useApp();
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const hideFooter = ["/login", "/register", "/subscribe"].some((p) =>
        pathname.startsWith(p),
    );

    // استرجاع آخر مكان سكرول عند عمل reload لنفس الصفحة (وليس أول فتح —
    // الجلسة الجديدة تبدأ من فوق). نحفظ المكان ونتركبه بعد ما المحتوى يتحمّل.
    useEffect(() => {
        const key = `siraj_scroll_${pathname}`;
        let y = 0;
        try {
            y = parseInt(sessionStorage.getItem(key) || "0", 10) || 0;
        } catch { /* ignore */ }
        const restore = () => {
            if (y > 0) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
        };
        restore();
        const t1 = setTimeout(restore, 500);
        const t2 = setTimeout(restore, 1500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onScroll = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    sessionStorage.setItem(
                        `siraj_scroll_${window.location.pathname}`,
                        String(window.scrollY),
                    );
                } catch { /* ignore */ }
            }, 150);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (timer) clearTimeout(timer);
        };
    }, []);

    return (
        <div dir={dir} className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
            <WhatsAppButton />
        </div>
    );
}

function RootComponent() {
    const { queryClient } = Route.useRouteContext();

    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <SiteLayout />
            </AppProvider>
        </QueryClientProvider>
    );
}
