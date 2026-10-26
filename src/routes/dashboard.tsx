import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../siraaj/pages/Dashboard";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/dashboard")({
    head: () => ({
        meta: [
            { title: "لوحة الطالب | سِراج" },
            { name: "description", content: "تابع حلقاتك واشتراكك وتقدّمك الدراسي في منصة سِراج." },
            { property: "og:title", content: "لوحة الطالب | سِراج" },
            { property: "og:description", content: "كل بيانات حلقاتك في مكان واحد." },
        ],
    }),
    component: () => (
        <Protected roles={["student", "guardian"]}>
            <Dashboard />
        </Protected>
    ),
});
