import { createFileRoute } from "@tanstack/react-router";
import Terms from "../siraaj/pages/Terms";

export const Route = createFileRoute("/terms")({
    head: () => ({
        meta: [
            { title: "الشروط والأحكام | سِراج" },
            { name: "description", content: "شروط وأحكام استخدام أكاديمية سراج واشتراكاتها التعليمية." },
            { property: "og:title", content: "الشروط والأحكام | سِراج" },
            { property: "og:description", content: "شروط استخدام منصة أكاديمية سراج واشتراكاتها التعليمية." },
        ],
    }),
    component: Terms,
});
