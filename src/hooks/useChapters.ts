import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";
import type { Chapter } from "@/data/chapters";

interface DbChapter extends Chapter {
  visibility: "public" | "archived";
  sort_order: number;
}

const rowToChapter = (r: Record<string, unknown>): DbChapter => ({
  id: r.id as string,
  era: (r.era as string) ?? "",
  eraDates: (r.era_dates as string) ?? undefined,
  title: r.title as string,
  subtitle: (r.subtitle as string) ?? undefined,
  pullQuote: (r.pull_quote as string) ?? "",
  hero: (r.hero as Chapter["hero"]) ?? { src: "", alt: "" },
  gallery: (r.gallery as Chapter["gallery"]) ?? [],
  intro: (r.intro as string[]) ?? [],
  timeline: (r.timeline as Chapter["timeline"]) ?? [],
  widgets: (r.widgets as Chapter["widgets"]) ?? [],
  keyPoints: (r.key_points as Chapter["keyPoints"]) ?? [],
  daleelInsight: (r.daleel_insight as string) ?? "",
  layout: (r.layout as Chapter["layout"]) ?? "primary",
  visibility: (r.visibility as "public" | "archived") ?? "public",
  sort_order: (r.sort_order as number) ?? 0,
});

/** Live list of chapters. Members see only public; admins see all. */
export const useChapters = () => {
  const { role } = useAuth();
  const [chapters, setChapters] = useState<DbChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error && data) setChapters(data.map(rowToChapter));
      setLoading(false);
    };
    load();

    const ch = supabase
      .channel("chapters-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chapters" },
        () => load(),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [role]);

  // Members see only public; admins see everything.
  const visible =
    role === "admin" ? chapters : chapters.filter((c) => c.visibility === "public");

  return { chapters: visible, all: chapters, loading };
};

export const useChapter = (id?: string | null) => {
  const { chapters, loading } = useChapters();
  const chapter = chapters.find((c) => c.id === id);
  const idx = chapters.findIndex((c) => c.id === id);
  return {
    chapter,
    loading,
    prev: idx > 0 ? chapters[idx - 1] : undefined,
    next: idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : undefined,
    index: idx,
    total: chapters.length,
  };
};

export type { DbChapter };
