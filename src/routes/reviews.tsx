import { createFileRoute } from "@tanstack/react-router";
import Reviews from "../siraaj/pages/Reviews";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/reviews")({
    head: () => ({
        meta: [
            { title: "آراء طلابنا | سِراج" },
            { name: "description", content: "فيديوهات وشهادات حقيقية من طلاب سِراج وأولياء الأمور عن تجربتهم في حلقات القرآن والتجويد." },
            { property: "og:title", content: "آراء طلابنا | سِراج" },
            { property: "og:description", content: "شاهد تجارب طلابنا وأولياء الأمور مع منصة سِراج." },
        ],
    }),
    component: () => (
        <Protected roles={["admin"]}>
            <Reviews />
        </Protected>
    ),
});
