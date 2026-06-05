import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { topics } from "@/data/topics";
import { ArrowRight, CheckCircle, XCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb, Calculator, HelpCircle, Circle, Trophy } from "lucide-react";

const UNIT_COLORS: Record<string, { badge: string; bg: string }> = {
  "الحركة والديناميكا":      { badge: "bg-blue-100 text-blue-700",   bg: "bg-blue-50" },
  "النواسات والاهتزازات":    { badge: "bg-purple-100 text-purple-700", bg: "bg-purple-50" },
  "الكهرومغناطيسية":         { badge: "bg-amber-100 text-amber-700",  bg: "bg-amber-50" },
  "ميكانيكا الموائع":        { badge: "bg-cyan-100 text-cyan-700",    bg: "bg-cyan-50" },
  "الأمواج والصوت":          { badge: "bg-green-100 text-green-700",  bg: "bg-green-50" },
  "النسبية والنووي":          { badge: "bg-rose-100 text-rose-700",    bg: "bg-rose-50" },
  "الكهرباء والمحولات":      { badge: "bg-orange-100 text-orange-700", bg: "bg-orange-50" },
};

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  theory:      { label: "نظري",    icon: <BookOpen className="w-3.5 h-3.5" />,    color: "bg-blue-100 text-blue-700" },
  mcq:         { label: "اختيار متعدد", icon: <HelpCircle className="w-3.5 h-3.5" />, color: "bg-purple-100 text-purple-700" },
  calculation: { label: "تطبيق حسابي", icon: <Calculator className="w-3.5 h-3.5" />, color: "bg-green-100 text-green-700" },
};

const getProgress = () => {
  try {
    const raw = localStorage.getItem("bac-physics-progress");
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

function QuestionCard({ question, index }: { question: typeof topics[0]["questions"][0]; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const typeInfo = TYPE_LABELS[question.type];

  const isCorrect = selected === question.answer;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs" data-testid={`card-question-${question.id}`}>
      {/* Question header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
                {typeInfo.icon}
                {typeInfo.label}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line">
              {question.text}
            </p>
          </div>
        </div>
      </div>

      {/* MCQ Options */}
      {question.type === "mcq" && question.options && (
        <div className="p-4 space-y-2">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isRight = opt === question.answer;
            let style = "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5";
            if (selected) {
              if (isSelected && isCorrect) style = "border-green-400 bg-green-50";
              else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50";
              else if (isRight) style = "border-green-400 bg-green-50";
              else style = "border-border bg-muted/20 opacity-60";
            }
            return (
              <button
                key={i}
                data-testid={`btn-option-${question.id}-${i}`}
                onClick={() => !selected && setSelected(opt)}
                className={`w-full text-right px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-3 ${style} ${!selected ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0 opacity-60">
                  {["أ","ب","ج","د"][i]}
                </span>
                <span className="flex-1">{opt}</span>
                {selected && isRight && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {selected && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
          {selected && (
            <div className={`mt-3 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة"}
            </div>
          )}
        </div>
      )}

      {/* Answer reveal for theory / calculation */}
      {question.type !== "mcq" && (
        <div className="p-4">
          <button
            data-testid={`btn-show-answer-${question.id}`}
            onClick={() => setShowAnswer((v) => !v)}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAnswer ? "إخفاء الإجابة" : "عرض الإجابة"}
          </button>
          {showAnswer && (
            <div className="mt-3 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> الإجابة
                </p>
                <p className="text-sm text-green-800 leading-relaxed whitespace-pre-line font-medium">
                  {question.answer}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> الشرح
                </p>
                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">
                  {question.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show explanation for MCQ after selecting */}
      {question.type === "mcq" && selected && (
        <div className="px-4 pb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> الشرح
            </p>
            <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopicDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [done, setDone] = useState<number[]>(getProgress);

  const topicId = parseInt(params.id ?? "0");
  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">الموضوع غير موجود</p>
          <button
            data-testid="btn-go-home"
            onClick={() => setLocation("/")}
            className="text-primary hover:underline"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const isDone = done.includes(topic.id);
  const colors = UNIT_COLORS[topic.unit] ?? UNIT_COLORS["الكهرومغناطيسية"];

  const toggleDone = () => {
    setDone((prev) => {
      const next = prev.includes(topic.id)
        ? prev.filter((x) => x !== topic.id)
        : [...prev, topic.id];
      localStorage.setItem("bac-physics-progress", JSON.stringify(next));
      return next;
    });
  };

  const prevTopic = topics.find((t) => t.id === topicId - 1);
  const nextTopic = topics.find((t) => t.id === topicId + 1);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <button
              data-testid="btn-back"
              onClick={() => setLocation("/")}
              className="flex items-center gap-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              القائمة
            </button>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                  {topic.unit}
                </span>
                <span className="text-xs text-sidebar-foreground/50">موضوع #{topic.id}</span>
              </div>
              <h1 className="text-lg font-bold leading-snug">{topic.title}</h1>
              {topic.page && (
                <p className="text-sm text-sidebar-foreground/60 mt-1">صفحة {topic.page}</p>
              )}
            </div>
            <button
              data-testid={`btn-mark-done-${topic.id}`}
              onClick={toggleDone}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                isDone
                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                  : "bg-sidebar-accent text-sidebar-foreground/80 hover:bg-sidebar-accent/80"
              }`}
            >
              {isDone ? (
                <><CheckCircle className="w-4 h-4" /> مراجَع</>
              ) : (
                <><Circle className="w-4 h-4" /> علّم كمراجَع</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Question count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <BookOpen className="w-4 h-4" />
          <span>{topic.questions.length} {topic.questions.length === 1 ? "سؤال" : "أسئلة"} تدريبية</span>
        </div>

        {/* Questions */}
        {topic.questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}

        {/* Done celebration */}
        {isDone && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-bold">أحسنت! راجعت هذا الموضوع</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-2 pb-6">
          {prevTopic ? (
            <button
              data-testid="btn-prev-topic"
              onClick={() => setLocation(`/topic/${prevTopic.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:border-primary/40 hover:bg-primary/5 transition-all flex-1 text-right"
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground text-xs">السابق</span>
              <span className="font-medium truncate">{prevTopic.title}</span>
            </button>
          ) : <div className="flex-1" />}

          {nextTopic ? (
            <button
              data-testid="btn-next-topic"
              onClick={() => setLocation(`/topic/${nextTopic.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:border-primary/40 hover:bg-primary/5 transition-all flex-1 text-left"
            >
              <span className="font-medium truncate">{nextTopic.title}</span>
              <span className="text-muted-foreground text-xs">التالي</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 rotate-180" />
            </button>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </div>
  );
}
