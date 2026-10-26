import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "../siraaj/pages/AdminDashboard";
import { Protected } from "../siraaj/Protected";

export const Route = createFileRoute("/admin")({
    head: () => ({
        meta: [
            { title: "لوحة الإدارة | سِراج" },
            { name: "description", content: "إدارة الباقات والبرامج والمعلمين ومحتوى منصة سِراج." },
            { property: "og:title", content: "لوحة الإدارة | سِراج" },
            { property: "og:description", content: "تحكم كامل في محتوى المنصة وبياناتها." },
        ],
    }),
    component: () => (
        <Protected roles={["admin"]}>
            <AdminDashboard />
        </Protected>
    ),
});
