import { createFileRoute } from "@tanstack/react-router";
import Privacy from "../siraaj/pages/Privacy";

export const Route = createFileRoute("/privacy")({
    head: () => ({
        meta: [
            { title: "سياسة الخصوصية | سِراج" },
            { name: "description", content: "تعرف على كيفية جمع أكاديمية سراج لبياناتكم وحمايتها واستخدامها." },
            { property: "og:title", content: "سياسة الخصوصية | سِراج" },
            { property: "og:description", content: "كيف نتعامل مع بياناتكم ونحميها في أكاديمية سراج." },
        ],
    }),
    component: Privacy,
});
