import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    lazyRouteComponent,
    createRootRouteWithContext,
    useRouterState,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

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
