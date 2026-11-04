import { createFileRoute } from "@tanstack/react-router";

// وكيل (proxy) لتمرير طلبات الواجهة إلى الـ backend الخارجي.
// السبب: الـ backend يعمل على http بينما المعاينة تعمل على https،
// فالمتصفح يمنع الطلبات المختلطة — لذلك نمرّرها من الخادم.
const BACKEND_ORIGIN = "http://siraaj.runasp.net/api";

const HOP_BY_HOP = new Set([
    "host",
    "connection",
    "content-length",
    "accept-encoding",
]);

async function proxy(request: Request, splat: string | undefined) {
    const incoming = new URL(request.url);
    const target = `${BACKEND_ORIGIN}/${splat ?? ""}${incoming.search}`;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
    });

    const method = request.method.toUpperCase();
    const body =
        method === "GET" || method === "HEAD" ? undefined : await request.text();

    try {
        const upstream = await fetch(target, { method, headers, body });
        // أخطاء الخادم الداخلي (5xx) من الـ backend الخارجي بنحوّلها لاستجابة
        // سليمة (success:false) عشان الواجهة تستخدم القيم الافتراضية ومايتسجلش
        // 500 في التليمتري. أخطاء 4xx بتتمرر زي ما هي.
        if (upstream.status >= 500) {
            console.error(
                `[backend-proxy] upstream ${upstream.status} on ${method} ${target}: ${await upstream.text().catch(() => "")}`,
            );
            return Response.json(
                {
                    success: false,
                    statusCode: upstream.status,
                    message: "تعذّر الاتصال بالخادم",
                },
                { status: 200 },
            );
        }
        const responseHeaders = new Headers();
        const contentType = upstream.headers.get("content-type");
        if (contentType) responseHeaders.set("content-type", contentType);
        return new Response(await upstream.arrayBuffer(), {
            status: upstream.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error(`[backend-proxy] network error on ${method} ${target}:`, error);
        return Response.json(
            { success: false, message: "تعذّر الاتصال بالخادم" },
            { status: 200 },
        );
    }
}

export const Route = createFileRoute("/api/public/backend/$")({
    server: {
        handlers: {
            GET: ({ request, params }) => proxy(request, params._splat),
            POST: ({ request, params }) => proxy(request, params._splat),
            PUT: ({ request, params }) => proxy(request, params._splat),
            PATCH: ({ request, params }) => proxy(request, params._splat),
            DELETE: ({ request, params }) => proxy(request, params._splat),
        },
    },
});
