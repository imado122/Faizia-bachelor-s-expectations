import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { topics, UNITS } from "@/data/topics";
import { BookOpen, Search, CheckCircle, Circle, ChevronLeft, Zap, Trophy, BookMarked } from "lucide-react";

const UNIT_COLORS: Record<string, { bg: string; text: string; badge: string; icon: string }> = {
  "الحركة والديناميكا":      { bg: "bg-blue-50",    text: "text-blue-700",   badge: "bg-blue-100 text-blue-700",   icon: "text-blue-500" },
  "النواسات والاهتزازات":    { bg: "bg-purple-50",  text: "text-purple-700", badge: "bg-purple-100 text-purple-700", icon: "text-purple-500" },
  "الكهرومغناطيسية":         { bg: "bg-amber-50",   text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  icon: "text-amber-500" },
  "ميكانيكا الموائع":        { bg: "bg-cyan-50",    text: "text-cyan-700",   badge: "bg-cyan-100 text-cyan-700",    icon: "text-cyan-500" },
  "الأمواج والصوت":          { bg: "bg-green-50",   text: "text-green-700",  badge: "bg-green-100 text-green-700",  icon: "text-green-500" },
  "النسبية والنووي":          { bg: "bg-rose-50",    text: "text-rose-700",   badge: "bg-rose-100 text-rose-700",    icon: "text-rose-500" },
  "الكهرباء والمحولات":      { bg: "bg-orange-50",  text: "text-orange-700", badge: "bg-orange-100 text-orange-700", icon: "text-orange-500" },
};

const getProgress = () => {
  try {
    const raw = localStorage.getItem("bac-physics-progress");
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("الكل");
  const [done, setDone] = useState<number[]>(getProgress);

  const filtered = useMemo(() => {
    return topics.filter((t) => {
      const matchUnit = selectedUnit === "الكل" || t.unit === selectedUnit;
      const matchSearch =
        !search ||
        t.title.includes(search) ||
        t.unit.includes(search);
      return matchUnit && matchSearch;
    });
  }, [search, selectedUnit]);

  const toggleDone = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("bac-physics-progress", JSON.stringify(next));
      return next;
    });
  };

  const progress = Math.round((done.length / topics.length) * 100);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-sidebar-primary/20 rounded-xl p-2.5">
              <BookMarked className="w-7 h-7 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">توقعات الفيزياء - بكالوريا دمشق</h1>
              <p className="text-sidebar-foreground/70 text-sm mt-0.5">57 موضوعاً متوقعاً مع أسئلة تدريبية</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-sidebar-accent/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-foreground/80">تقدمك في المراجعة</span>
              <span className="text-sm font-bold text-sidebar-primary">{done.length}/{topics.length} موضوع</span>
            </div>
            <div className="h-2.5 bg-sidebar-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-sidebar-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-sidebar-foreground/60">{progress}% مكتمل</span>
              {progress === 100 && (
                <span className="text-xs text-sidebar-primary font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> أحسنت! راجعت الكل
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-primary">{topics.length}</div>
            <div className="text-xs text-muted-foreground mt-1">موضوع متوقع</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-green-600">{done.length}</div>
            <div className="text-xs text-muted-foreground mt-1">راجعتهم</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-amber-600">{topics.length - done.length}</div>
            <div className="text-xs text-muted-foreground mt-1">باقي</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-search"
            type="text"
            placeholder="ابحث عن موضوع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Unit filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["الكل", ...UNITS].map((u) => (
            <button
              key={u}
              data-testid={`filter-unit-${u}`}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedUnit === u
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {u}
              {u !== "الكل" && (
                <span className="mr-1 opacity-70">({topics.filter((t) => t.unit === u).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Topics list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد نتائج</p>
            </div>
          ) : (
            filtered.map((topic) => {
              const colors = UNIT_COLORS[topic.unit] ?? UNIT_COLORS["الكهرومغناطيسية"];
              const isDone = done.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  data-testid={`card-topic-${topic.id}`}
                  onClick={() => setLocation(`/topic/${topic.id}`)}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center gap-3 ${
                    isDone ? "border-green-200 bg-green-50/40" : "border-border hover:border-primary/30"
                  }`}
                >
                  {/* Check button */}
                  <button
                    data-testid={`btn-check-${topic.id}`}
                    onClick={(e) => toggleDone(e, topic.id)}
                    className="flex-shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/40 hover:text-primary transition-colors" />
                    )}
                  </button>

                  {/* Number badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${colors.badge}`}>
                    {topic.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm leading-snug ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {topic.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {topic.unit}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {topic.questions.length} {topic.questions.length === 1 ? "سؤال" : "أسئلة"}
                      </span>
                    </div>
                  </div>

                  <ChevronLeft className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                </div>
              );
            })
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
          اضغط على دائرة الاختيار لتحديد الموضوع كمراجَع ✓
        </p>
      </div>
    </div>
  );
}
