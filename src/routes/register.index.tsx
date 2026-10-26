import { createFileRoute } from "@tanstack/react-router";
import Register from "../siraaj/pages/Register";

export const Route = createFileRoute("/register/")({
    head: () => ({
        meta: [
            { title: "إنشاء حساب | سِراج" },
            { name: "description", content: "أنشئ حسابك في منصة سِراج كطالب أو ولي أمر وابدأ حلقاتك القرآنية." },
            { property: "og:title", content: "إنشاء حساب | سِراج" },
            { property: "og:description", content: "التسجيل في منصة سِراج يستغرق أقل من دقيقة." },
        ],
    }),
    component: Register,
});
