import { createFileRoute } from "@tanstack/react-router";
import Landing from "../siraaj/pages/Landing";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
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
        ],
    }),
    component: Landing,
});
