import { createFileRoute } from "@tanstack/react-router";
import TeacherDashboard from "../siraaj/pages/TeacherDashboard";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/teacher")({
    head: () => ({
        meta: [
            { title: "لوحة المعلم | سِراج" },
            { name: "description", content: "تابع طلابك ومواعيد حلقاتك وحضورهم من لوحة المعلم في سِراج." },
            { property: "og:title", content: "لوحة المعلم | سِراج" },
            { property: "og:description", content: "جدول حلقاتك وطلابك في مكان واحد." },
        ],
    }),
    component: () => (
        <Protected roles={["teacher"]}>
            <TeacherDashboard />
        </Protected>
    ),
});
