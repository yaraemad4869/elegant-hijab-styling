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
        const responseHeaders = new Headers();
        const contentType = upstream.headers.get("content-type");
        if (contentType) responseHeaders.set("content-type", contentType);
        return new Response(await upstream.arrayBuffer(), {
            status: upstream.status,
            headers: responseHeaders,
        });
    } catch {
        return Response.json(
            { success: false, message: "تعذّر الاتصال بالخادم" },
            { status: 502 },
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
