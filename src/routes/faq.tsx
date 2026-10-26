import { createFileRoute } from "@tanstack/react-router";
import Faq from "../siraaj/pages/Faq";

export const Route = createFileRoute("/faq")({
    head: () => ({
        meta: [
            { title: "الأسئلة الشائعة | سِراج" },
            { name: "description", content: "إجابات عن أكثر الأسئلة تكراراً حول حلقات سِراج ومواعيدها وطرق الدفع والخصومات." },
            { property: "og:title", content: "الأسئلة الشائعة | سِراج" },
            { property: "og:description", content: "كل ما تودّ معرفته قبل الانضمام إلى حلقات سِراج." },
        ],
    }),
    component: Faq,
});
