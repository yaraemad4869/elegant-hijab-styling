import { createFileRoute } from "@tanstack/react-router";
import Subscribe from "../siraaj/pages/Subscribe";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/subscribe")({
    head: () => ({
        meta: [
            { title: "الاشتراك والدفع | سِراج" },
            { name: "description", content: "اختر باقتك وأكمل عملية الدفع للانضمام إلى حلقات سِراج." },
            { property: "og:title", content: "الاشتراك والدفع | سِراج" },
            { property: "og:description", content: "باقات مرنة وطرق دفع متعددة." },
        ],
    }),
    component: () => (
        <Protected>
            <Subscribe />
        </Protected>
    ),
});
