import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useChapters } from "@/hooks/useChapters";

/**
 * ChaptersScreen
 * Index of all historical-journey chapters from Lovable Cloud. Members see
 * only chapters with visibility = 'public'; admins additionally see archived
 * chapters (badged) and can toggle visibility from the chapter detail screen.
 */
const Journey = () => {
  const { chapters: CHAPTERS, loading } = useChapters();
  return (
    <AppShell title="Historical Journey">
      <section className="px-6 pt-2 pb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          The Living Ledger
        </p>
        <h1 className="font-serif font-bold text-foreground text-[2.25rem] leading-[1.05] mt-1">
          Chapters
        </h1>
        <p className="text-muted-foreground text-sm mt-3">
          Walk the timeline of the land — from the Bronze Age stones of Jericho to the
          Ottoman souks of Nablus.
        </p>
      </section>

      {/* Continuous timeline rail */}
      <section className="px-6 mb-6 relative">
        <div className="absolute top-1/2 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-y-1/2" />
        <div className="relative flex justify-between items-center py-3">
          {CHAPTERS.map((c) => (
            <Link
              key={c.id}
              to={`/journey/${c.id}`}
              className="flex flex-col items-center gap-2 group"
            >
              <span className="w-3 h-3 rounded-full bg-surface-bright border border-border group-hover:bg-primary group-hover:glow-soft transition-all" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                {c.timeline.find((t) => t.active)?.label ?? c.timeline[0]?.label ?? ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Chapter cards */}
      <section className="px-6 space-y-4 pb-8">
        {loading && (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground py-10">
            Loading chapters…
          </p>
        )}
        {!loading && CHAPTERS.length === 0 && (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground py-10">
            No chapters available yet.
          </p>
        )}
        {CHAPTERS.map((c, i) => (
          <Link
            key={c.id}
            to={`/journey/${c.id}`}
            className="block group"
            aria-label={`Open chapter: ${c.title}`}
          >
            <article className="relative bg-surface-container ghost-border rounded-[1.75rem] overflow-hidden shadow-elevated transition-transform group-hover:-translate-y-0.5">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={c.hero.src}
                  alt={c.hero.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />
                <span className="absolute top-4 left-4 inline-block bg-background/70 backdrop-blur-md ghost-border text-primary text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full">
                  Chapter {String(i + 1).padStart(2, "0")}
                </span>
                {c.visibility === "archived" && (
                  <span className="absolute top-4 right-4 inline-block bg-crimson/80 text-destructive-foreground text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full">
                    Archived
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
                  {c.era}
                </p>
                <h2 className="font-serif font-bold text-foreground text-xl leading-tight mt-2">
                  {c.title}
                </h2>
                {c.eraDates && (
                  <p className="text-[11px] text-muted-foreground mt-1">{c.eraDates}</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold flex items-center gap-1">
                    Open chapter <Icon name="arrow_forward" size={16} />
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Icon name="bookmark_border" size={14} />
                    {c.keyPoints.length} points
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </AppShell>
  );
};

export default Journey;
