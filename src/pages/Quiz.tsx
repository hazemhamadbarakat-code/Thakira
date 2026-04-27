import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

/**
 * Heritage Quiz — Recent History of Palestine (Level 4 · Modern Era)
 * --------------------------------------------------------------------
 * Flow:  Intro → Q1 → Feedback → Q2 → ... → Q5 → Feedback → Results
 *
 * The bottom navigation (AppShell) stays visible across every step and
 * highlights the "Quiz" tab. Each step exposes a back button (in-flow
 * navigation) and an exit (X) confirmation that returns to /discover.
 * The results screen is unreachable until the user has answered all 5
 * questions — guarded by `stage` state, not by a route the user can
 * type into the URL bar.
 */

interface Question {
  id: number;
  prompt: string;
  options: string[];
  /** index of the correct option in `options` */
  correctIndex: number;
  /** Short explanation shown on the feedback screen. */
  rationale: string;
  hint?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Which city was historically known as the 'Bride of the Sea'?",
    options: ["Jerusalem", "Haifa", "Jaffa", "Gaza"],
    correctIndex: 2,
    rationale:
      "Jaffa — Arūs al-Bahr — earned the title for its ancient harbour and the famous orange groves that lined its coast.",
    hint: "Think of the ancient citrus trade and its world-famous orange groves.",
  },
  {
    id: 2,
    prompt:
      "Which ancient city is home to Hisham's Palace, famous for its intricate 'Tree of Life' floor mosaic?",
    options: ["Nablus", "Jericho", "Hebron", "Bethlehem"],
    correctIndex: 1,
    rationale:
      "Hisham's Palace (Khirbat al-Mafjar) sits just north of Jericho and dates to the Umayyad period (8th c. CE).",
    hint: "It is the oldest continuously inhabited city in the world.",
  },
  {
    id: 3,
    prompt:
      "Which event in 1948 is commemorated by Palestinians as the 'Nakba' (catastrophe)?",
    options: [
      "The fall of the Ottoman Empire",
      "The mass displacement during the establishment of Israel",
      "The Six-Day War",
      "The First Intifada",
    ],
    correctIndex: 1,
    rationale:
      "The Nakba refers to the displacement of approximately 750,000 Palestinians during the 1948 war and the loss of historic Palestine.",
    hint: "It marks a pivotal demographic and territorial rupture in modern Palestinian history.",
  },
  {
    id: 4,
    prompt:
      "This coastal city was a major centre for the mother-of-pearl industry and served as a primary port for pilgrims travelling to Jerusalem.",
    options: ["Akka", "Ashkelon", "Haifa", "Jaffa"],
    correctIndex: 0,
    rationale:
      "Akka (Acre) — its old port welcomed Mediterranean pilgrims for centuries and its artisans were renowned for mother-of-pearl craftsmanship.",
    hint: "Its Crusader-era walls still stand, and Napoleon famously failed to take it in 1799.",
  },
  {
    id: 5,
    prompt:
      "Which Palestinian poet authored 'Identity Card' and became a defining literary voice of the 20th century?",
    options: ["Ghassan Kanafani", "Edward Said", "Mahmoud Darwish", "Fadwa Tuqan"],
    correctIndex: 2,
    rationale:
      "Mahmoud Darwish (1941–2008) wrote 'Bitaqat Hawiyya' (Identity Card) in 1964; it remains an anthem of Palestinian identity.",
    hint: "He was born in al-Birwa and is widely regarded as Palestine's national poet.",
  },
];

type Stage =
  | { kind: "intro" }
  | { kind: "question"; index: number }
  | { kind: "feedback"; index: number; pickedIndex: number }
  | { kind: "results" };

const Quiz = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  /** picked option per question id (undefined = unanswered) */
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const total = QUESTIONS.length;
  const score = useMemo(
    () =>
      QUESTIONS.reduce(
        (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
        0,
      ),
    [answers],
  );

  /* ───────────────────────── helpers ───────────────────────── */

  const startQuiz = () => {
    setAnswers({});
    setShowHint(false);
    setStage({ kind: "question", index: 0 });
  };

  const submitAnswer = (q: Question, pickedIndex: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: pickedIndex }));
    setStage({ kind: "feedback", index: stage.kind === "question" ? stage.index : 0, pickedIndex });
  };

  const advance = () => {
    if (stage.kind !== "feedback") return;
    const next = stage.index + 1;
    setShowHint(false);
    if (next >= total) {
      setStage({ kind: "results" });
    } else {
      setStage({ kind: "question", index: next });
    }
  };

  const goBack = () => {
    if (stage.kind === "intro") {
      navigate(-1);
      return;
    }
    if (stage.kind === "question") {
      if (stage.index === 0) {
        setStage({ kind: "intro" });
      } else {
        // Re-open the previous feedback so the user can see what they answered
        const prevIdx = stage.index - 1;
        const prevQ = QUESTIONS[prevIdx];
        const picked = answers[prevQ.id];
        if (picked !== undefined) {
          setStage({ kind: "feedback", index: prevIdx, pickedIndex: picked });
        } else {
          setStage({ kind: "question", index: prevIdx });
        }
      }
      return;
    }
    if (stage.kind === "feedback") {
      setStage({ kind: "question", index: stage.index });
      return;
    }
    if (stage.kind === "results") {
      // From results, going back returns to the intro (cannot re-edit a completed quiz)
      setStage({ kind: "intro" });
    }
  };

  const requestExit = () => setConfirmExit(true);
  const confirmAndExit = () => {
    setConfirmExit(false);
    setStage({ kind: "intro" });
    setAnswers({});
    setShowHint(false);
    navigate("/discover");
  };

  /* ───────────────────────── header ───────────────────────── */

  const inFlow = stage.kind !== "intro";
  const customHeader = (
    <header className="relative z-30 flex items-center justify-between px-5 py-4 bg-surface/90 backdrop-blur-sm">
      <button
        onClick={goBack}
        className="w-10 h-10 -ml-2 flex items-center justify-center text-primary rounded-full hover:bg-surface-high/60 transition-colors"
        aria-label="Back"
      >
        <Icon name="arrow_back" size={26} />
      </button>
      <h1 className="font-serif font-bold text-primary text-xl tracking-[0.2em]">
        {stage.kind === "results" ? "QUIZ COMPLETE" : "HERITAGE QUIZ"}
      </h1>
      <button
        onClick={inFlow ? requestExit : () => navigate("/discover")}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-primary rounded-full hover:bg-surface-high/60 transition-colors"
        aria-label={inFlow ? "Exit quiz" : "Close"}
      >
        <Icon name="close" size={24} />
      </button>
    </header>
  );

  /* ───────────────────────── renderers ───────────────────────── */

  const renderIntro = () => (
    <section className="px-6 pt-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Heritage Preserved
      </p>
      <h2 className="font-serif font-bold text-primary text-[2.25rem] leading-[1.05] mt-1 text-shadow-gold">
        Recent History<br />of Palestine
      </h2>
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mt-3">
        Level 4 · Modern Era
      </p>

      <div className="mt-6 rounded-[1.5rem] bg-surface-container ghost-border h-44 flex items-center justify-center overflow-hidden">
        <div className="absolute-inset-0 w-full h-full bg-gradient-to-br from-primary/10 via-surface-high/20 to-surface-low flex items-center justify-center">
          <Icon name="auto_stories" filled size={56} className="text-primary/60" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-2xl bg-surface-container ghost-border p-4">
          <Icon name="list_alt" filled className="text-primary" size={20} />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
            Questions
          </p>
          <p className="font-serif text-foreground text-2xl mt-1">{total}</p>
        </div>
        <div className="rounded-2xl bg-surface-container ghost-border p-4">
          <Icon name="schedule" filled className="text-primary" size={20} />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
            Time
          </p>
          <p className="font-serif text-foreground text-2xl mt-1">~3 min</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-surface-container ghost-border p-4 flex items-center gap-4">
        <Icon name="shield" filled className="text-primary" size={22} />
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Difficulty
          </p>
          <p className="font-serif text-foreground text-xl mt-0.5">
            Medium <span className="text-primary tracking-widest ml-1">• •</span>
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground text-center px-2">
        Test your knowledge on the pivotal events, cultural shifts, and historical
        milestones of the last century. Complete this level to unlock the next
        chapter in the archive.
      </p>

      <button
        onClick={startQuiz}
        className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold tracking-[0.18em] glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all"
      >
        START QUIZ →
      </button>
    </section>
  );

  const renderQuestion = (index: number) => {
    const q = QUESTIONS[index];
    const picked = answers[q.id];
    const progress = ((index) / total) * 100;
    return (
      <section className="px-6 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Question {index + 1} of {total}
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-surface-high overflow-hidden">
          <div
            className="h-full bg-primary glow-soft transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
          Heritage Preserved
        </p>
        <p className="font-serif text-foreground text-base mt-1">Heritage Quiz</p>

        <h2 className="font-serif font-bold text-primary text-[1.6rem] leading-[1.2] mt-3 text-shadow-gold">
          {q.prompt}
        </h2>

        {q.hint && (
          <div className="mt-4">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/80 hover:text-primary"
              >
                <Icon name="auto_awesome" size={16} />
                Need a hint?
              </button>
            ) : (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-soft shrink-0">
                  <Icon name="auto_awesome" filled size={18} />
                </div>
                <div className="rounded-2xl bg-surface-container ghost-border p-3 italic text-sm text-muted-foreground">
                  "{q.hint}"
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {q.options.map((label, i) => {
            const isPicked = picked === i;
            return (
              <button
                key={label}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q.id]: i }))
                }
                className={`w-full flex items-center justify-between px-5 py-4 rounded-full ghost-border text-left transition-all ${
                  isPicked
                    ? "bg-primary/10 border-primary text-foreground glow-soft"
                    : "bg-surface-container text-foreground hover:border-primary/40"
                }`}
              >
                <span className="font-serif">{label}</span>
                <span
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    isPicked
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          disabled={picked === undefined}
          onClick={() => picked !== undefined && submitAnswer(q, picked)}
          className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold tracking-[0.18em] glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          CONFIRM ANSWER
        </button>
      </section>
    );
  };

  const renderFeedback = (index: number, pickedIndex: number) => {
    const q = QUESTIONS[index];
    const isCorrect = pickedIndex === q.correctIndex;
    const progress = ((index + 1) / total) * 100;
    const isFinal = index === total - 1;

    return (
      <section className="px-6 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Question {index + 1} of {total}
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-surface-high overflow-hidden">
          <div
            className="h-full bg-primary glow-soft transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="font-serif font-bold text-primary text-[1.4rem] leading-[1.25] mt-5 text-shadow-gold">
          {q.prompt}
        </h2>

        <div className="mt-5 space-y-3">
          {q.options.map((label, i) => {
            const isAnswer = i === q.correctIndex;
            const isPicked = i === pickedIndex;
            const wrongPick = isPicked && !isAnswer;
            return (
              <div
                key={label}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-full border text-left transition-all ${
                  isAnswer
                    ? "bg-secondary/15 border-secondary text-secondary glow-soft"
                    : wrongPick
                    ? "bg-crimson/10 border-crimson text-crimson glow-crimson"
                    : "bg-surface-container border-border text-foreground/70"
                }`}
              >
                <span className="font-serif">{label}</span>
                {isAnswer && (
                  <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Icon name="check" size={16} />
                  </span>
                )}
                {wrongPick && (
                  <span className="w-7 h-7 rounded-full bg-crimson text-destructive-foreground flex items-center justify-center">
                    <Icon name="close" size={16} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`mt-6 rounded-2xl border p-5 ${
            isCorrect
              ? "bg-secondary/10 border-secondary/40"
              : "bg-crimson/5 border-crimson/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCorrect
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-crimson text-destructive-foreground"
              }`}
            >
              <Icon name={isCorrect ? "check" : "close"} size={18} />
            </span>
            <p
              className={`font-serif font-bold text-lg ${
                isCorrect ? "text-secondary" : "text-crimson"
              }`}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {q.rationale}
          </p>
        </div>

        <button
          onClick={advance}
          className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold tracking-[0.18em] glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all"
        >
          {isFinal ? "VIEW RESULTS →" : "NEXT QUESTION →"}
        </button>
      </section>
    );
  };

  const renderResults = () => {
    const pct = (score / total) * 100;
    const incorrect = total - score;
    const message =
      score === total
        ? "Perfect — a true keeper of the archive."
        : score >= Math.ceil(total * 0.8)
        ? "Excellent understanding of the archival records."
        : score >= Math.ceil(total * 0.6)
        ? "A solid foundation. Revisit a chapter to deepen the thread."
        : "The archive is vast — return when you are ready to continue.";

    // SVG circular progress
    const radius = 86;
    const circumference = 2 * Math.PI * radius;
    const dash = (pct / 100) * circumference;

    return (
      <section className="px-6 pt-2">
        <div className="flex items-center justify-center mt-4">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 -rotate-90 drop-shadow-[0_0_18px_hsl(var(--primary)/0.55)]"
            >
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="hsl(var(--surface-high))"
                strokeWidth="14"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${circumference - dash}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="text-center">
              <p className="font-serif font-bold text-primary text-6xl leading-none">
                {score}
              </p>
              <div className="w-10 h-px bg-primary/40 mx-auto my-2" />
              <p className="text-foreground/70 text-lg">{total}</p>
            </div>
          </div>
        </div>

        <p className="text-center italic text-foreground/80 mt-5 px-3">
          "{message}"
        </p>

        <div className="grid grid-cols-2 gap-3 mt-7">
          <div className="rounded-2xl bg-surface-container ghost-border p-4">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Icon name="check" size={16} />
            </span>
            <p className="font-serif text-secondary text-3xl mt-2">+{score}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Correct
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container ghost-border p-4">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Icon name="close" size={16} />
            </span>
            <p className="font-serif text-crimson text-3xl mt-2">-{incorrect}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Incorrect
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container ghost-border p-4">
            <Icon name="schedule" filled className="text-primary" size={20} />
            <p className="font-serif text-foreground text-2xl mt-2">~3m</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Total Time
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container ghost-border p-4">
            <Icon name="account_balance" filled className="text-primary" size={20} />
            <p className="font-serif text-primary text-2xl mt-2">+{score}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
              Heritage Points
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/archive")}
          className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold tracking-[0.18em] glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all"
        >
          EXPLORE ARCHIVES →
        </button>

        <button
          onClick={startQuiz}
          className="mt-3 mb-4 w-full py-3 rounded-full ghost-border bg-surface-container text-foreground/80 font-serif tracking-[0.18em] uppercase text-sm hover:bg-surface-high/60 transition-colors"
        >
          Retake Quiz
        </button>
      </section>
    );
  };

  /* ───────────────────────── shell ───────────────────────── */

  return (
    <AppShell customHeader={customHeader}>
      {stage.kind === "intro" && renderIntro()}
      {stage.kind === "question" && renderQuestion(stage.index)}
      {stage.kind === "feedback" && renderFeedback(stage.index, stage.pickedIndex)}
      {stage.kind === "results" && renderResults()}

      {/* Exit confirmation */}
      {confirmExit && (
        <div
          onClick={() => setConfirmExit(false)}
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-surface-low ghost-border shadow-elevated p-6"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-crimson/15 text-crimson flex items-center justify-center">
                <Icon name="warning" filled size={22} />
              </span>
              <h3 className="font-serif font-bold text-primary text-xl">Exit quiz?</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your progress on this attempt will be lost. You can restart the quiz
              from the beginning at any time.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmExit(false)}
                className="py-3 rounded-full ghost-border bg-surface-container text-foreground text-sm font-bold tracking-widest uppercase"
              >
                Continue
              </button>
              <button
                onClick={confirmAndExit}
                className="py-3 rounded-full bg-crimson text-destructive-foreground text-sm font-bold tracking-widest uppercase glow-crimson"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Quiz;
