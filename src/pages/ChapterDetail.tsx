import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useChapter } from "@/hooks/useChapters";
import { useAuth } from "@/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ChapterDetail = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { chapter, prev, next, index, total, loading } = useChapter(chapterId);

  if (loading) {
    return (
      <AppShell title="Historical Journey" back>
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground py-12">
          Loading chapter…
        </p>
      </AppShell>
    );
  }

  if (!chapter) {
    return (
      <AppShell title="Chapter not found" back>
        <div className="px-6 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            We couldn't locate that chapter in the archive.
          </p>
          <Link
            to="/journey"
            className="inline-flex items-center gap-1 mt-4 text-primary text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <Icon name="arrow_back" size={16} /> Back to Chapters
          </Link>
        </div>
      </AppShell>
    );
  }

  const toggleVisibility = async () => {
    const next = chapter.visibility === "public" ? "archived" : "public";
    const { error } = await supabase
      .from("chapters")
      .update({ visibility: next })
      .eq("id", chapter.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Visibility updated",
        description: `Chapter is now ${next}.`,
      });
    }
  };


  return (
    <AppShell title="Historical Journey" back>
      <article className="px-4 pt-2 pb-8 space-y-8">
        {role === "admin" && (
          <div className="flex items-center justify-between rounded-2xl bg-surface-container ghost-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Icon
                name={chapter.visibility === "public" ? "visibility" : "visibility_off"}
                className={chapter.visibility === "public" ? "text-secondary" : "text-crimson"}
                size={20}
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Visibility</p>
                <p className="font-serif text-sm text-foreground capitalize">{chapter.visibility}</p>
              </div>
            </div>
            <button
              onClick={toggleVisibility}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.2em] font-bold glow-soft hover:bg-primary-glow"
            >
              {chapter.visibility === "public" ? "Archive" : "Make Public"}
            </button>
          </div>
        )}
        {/* ---------- Timeline slider ---------- */}
        <section className="relative py-4">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border/40 -translate-y-1/2" />
          <div className="relative flex justify-between items-center px-2">
            {chapter.timeline.map((t) => (
              <div
                key={t.label}
                className={`flex flex-col items-center gap-2 ${
                  t.active ? "-translate-y-1" : ""
                }`}
              >
                <span
                  className={
                    t.active
                      ? "w-4 h-4 rounded-full bg-primary glow-gold flex items-center justify-center z-10"
                      : "w-2.5 h-2.5 rounded-full bg-surface-bright border border-border"
                  }
                >
                  {t.active && <span className="w-1.5 h-1.5 rounded-full bg-background" />}
                </span>
                <span
                  className={`text-[10px] tracking-widest font-medium ${
                    t.active ? "text-primary text-xs font-bold" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Primary story card ---------- */}
        <section className="relative bg-card ghost-border rounded-[1.75rem] overflow-hidden shadow-elevated">
          {/* Hero image (top variant for media-top/scientific layouts; inline for primary/editorial) */}
          {chapter.layout === "primary" || chapter.layout === "editorial" ? (
            <div className="p-6">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-primary mb-2">
                {chapter.era}
              </span>
              <h2 className="font-serif font-bold text-foreground text-3xl leading-tight mb-6 pr-4">
                {chapter.title}
                {chapter.subtitle && (
                  <>
                    <br />
                    <span className="text-muted-foreground font-normal">
                      {chapter.subtitle}
                    </span>
                  </>
                )}
              </h2>

              <div className="w-full h-48 rounded-[1.25rem] overflow-hidden mb-6 relative group ghost-border">
                <img
                  src={chapter.hero.src}
                  alt={chapter.hero.alt}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    chapter.layout === "editorial" ? "grayscale opacity-90" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent" />
              </div>

              <Quote text={chapter.pullQuote} />
              <ReadArchiveCta chapterId={chapter.id} />
            </div>
          ) : (
            <>
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={chapter.hero.src}
                  alt={chapter.hero.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-background/70 backdrop-blur-md ghost-border text-primary text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full">
                    {chapter.era}
                  </span>
                </div>
              </div>
              <div className="px-6 pt-2 pb-8 -mt-6 relative">
                <h2 className="font-serif text-[1.75rem] leading-tight font-bold text-foreground mb-6 pr-4">
                  {chapter.title}
                  {chapter.subtitle && (
                    <>
                      <br />
                      <span className="text-muted-foreground font-normal">
                        {chapter.subtitle}
                      </span>
                    </>
                  )}
                </h2>
                <Quote text={chapter.pullQuote} />
                <ReadArchiveCta chapterId={chapter.id} />
              </div>
            </>
          )}

          {/* Floating "add memory" FAB overlapping the card */}
          <Link
            to="/contribute"
            aria-label="Contribute a memory"
            className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground glow-gold flex items-center justify-center hover:bg-primary-glow hover:-translate-y-1 transition-all z-20 ring-4 ring-background"
          >
            <Icon name="add" size={26} weight={600} />
          </Link>
        </section>

        {/* ---------- Bento widgets ---------- */}
        <section className="grid grid-cols-2 gap-4">
          {chapter.widgets.map((w) => (
            <div
              key={w.label}
              className="glass ghost-border p-4 rounded-2xl flex flex-col justify-between min-h-[110px] relative overflow-hidden"
            >
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 block">
                {w.label}
              </span>
              <div className="flex items-start gap-2">
                {w.icon ? (
                  <Icon name={w.icon} filled className="text-primary flex-shrink-0" size={18} />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0 ${
                      w.pulse ? "glow-soft" : ""
                    }`}
                  />
                )}
                <span className="text-sm text-foreground font-medium leading-snug">
                  {w.value}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ---------- Chapter footer / nav ---------- */}
        <section className="flex items-center justify-between pt-2">
          <button
            disabled={!prev}
            onClick={() => prev && navigate(`/journey/${prev.id}`)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary disabled:text-muted-foreground/40 disabled:cursor-not-allowed font-semibold"
          >
            <Icon name="arrow_back" size={16} /> Prev
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Chapter {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            disabled={!next}
            onClick={() => next && navigate(`/journey/${next.id}`)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary disabled:text-muted-foreground/40 disabled:cursor-not-allowed font-semibold"
          >
            Next <Icon name="arrow_forward" size={16} />
          </button>
        </section>
      </article>
    </AppShell>
  );
};

// ---------- Sub-components (kept local to preserve provided structure) ----------

const Quote = ({ text }: { text: string }) => (
  <div className="flex gap-4 mb-6">
    <div className="w-1 bg-primary/60 rounded-full flex-shrink-0" />
    <p className="font-serif italic text-muted-foreground text-base leading-relaxed">
      {text}
    </p>
  </div>
);

const ReadArchiveCta = ({ chapterId }: { chapterId: string }) => (
  <Link
    to={`/archive/${chapterId}`}
    className="inline-flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-[0.25em] hover:text-primary-glow transition-colors group/btn"
  >
    Read Archive
    <Icon
      name="arrow_forward"
      size={16}
      className="group-hover/btn:translate-x-1 transition-transform"
    />
  </Link>
);

export default ChapterDetail;
