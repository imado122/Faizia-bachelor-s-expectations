import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">الصفحة غير موجودة</p>
        <button
          onClick={() => setLocation("/")}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
