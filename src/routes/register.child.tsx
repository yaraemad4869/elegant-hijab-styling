import { createFileRoute } from "@tanstack/react-router";
import RegisterChild from "../siraaj/pages/RegisterChild";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/register/child")({
    head: () => ({
        meta: [
            { title: "تسجيل بيانات الطفل | سِراج" },
            { name: "description", content: "أضف بيانات طفلك ومواعيد حلقاته لإتمام الاشتراك في منصة سِراج." },
            { property: "og:title", content: "تسجيل بيانات الطفل | سِراج" },
            { property: "og:description", content: "خطوة أخيرة قبل تفعيل اشتراك طفلك." },
        ],
    }),
    component: () => (
        <Protected roles={["guardian"]}>
            <RegisterChild />
        </Protected>
    ),
});
