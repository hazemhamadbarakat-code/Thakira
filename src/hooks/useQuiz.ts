import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  hint?: string;
}

export interface QuizMeta {
  id: string;
  title: string;
  description: string | null;
  reward_points: number;
}

export const useQuiz = () => {
  const [quiz, setQuiz] = useState<QuizMeta | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: quizzes } = await supabase
        .from("quizzes")
        .select("id,title,description,reward_points")
        .eq("is_published", true)
        .order("created_at", { ascending: true })
        .limit(1);

      const q = quizzes?.[0];
      if (!q) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data: qs } = await supabase
        .from("questions")
        .select("id,question_text,choices,correct_answer,rationale,hint,sort_order")
        .eq("quiz_id", q.id)
        .order("sort_order", { ascending: true });

      if (cancelled) return;
      setQuiz(q as QuizMeta);
      setQuestions(
        (qs ?? []).map((row) => ({
          id: row.id as string,
          prompt: row.question_text as string,
          options: row.choices as string[],
          correctIndex: row.correct_answer as number,
          rationale: (row.rationale as string) ?? "",
          hint: (row.hint as string) ?? undefined,
        })),
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { quiz, questions, loading };
};
