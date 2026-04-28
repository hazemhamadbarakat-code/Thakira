import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useChapter } from "@/hooks/useChapters";

const ArchiveDetail = () => {
  const { archiveId } = useParams<{ archiveId: string }>();
  const navigate = useNavigate();
  const { chapter, loading } = useChapter(archiveId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading…</p>
      </div>
    );
  }


  // Edge case: invalid id
  if (!chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Archive not found.</p>
          <Link
            to="/journey"
            className="inline-flex items-center gap-1 mt-4 text-primary text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <Icon name="arrow_back" size={16} /> Back to Chapters
          </Link>
        </div>
      </div>
    );
  }

  const gallery = chapter.gallery?.length ? chapter.gallery : [chapter.hero];

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <main className="relative w-full max-w-[420px] min-h-screen bg-card flex flex-col overflow-hidden border-x border-border/20">
        {/* Floating close header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-4 pb-3 bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
          <div className="flex-1" />
          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="pointer-events-auto w-10 h-10 rounded-full glass ghost-border flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors glow-soft"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Gallery — horizontal snap */}
          <section className="relative h-[280px] w-full overflow-x-auto flex snap-x snap-mandatory no-scrollbar">
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
            {gallery.map((g, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-5 z-20 flex space-x-1.5">
                <span className="w-8 h-1 rounded-full bg-primary glow-soft" />
                {gallery.slice(1).map((_, i) => (
                  <span key={i} className="w-2 h-1 rounded-full bg-border opacity-60" />
                ))}
              </div>
            )}
          </section>

          {/* Sticky era header */}
          <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl px-6 py-5 border-b border-primary/20">
            <span className="block text-primary text-[11px] font-medium tracking-[0.25em] mb-2 uppercase">
              {chapter.era}
              {chapter.eraDates && (
                <span className="text-muted-foreground/80 normal-case font-normal">
                  {" "}
                  · {chapter.eraDates}
                </span>
              )}
            </span>
            <h1 className="font-serif font-bold text-foreground text-3xl leading-tight">
              {chapter.title}
            </h1>
          </div>

          {/* Body */}
          <article className="px-6 pt-6 pb-12 space-y-10 max-w-3xl mx-auto">
            {/* Intro paragraphs */}
            <div>
              {chapter.intro.map((p, i) => (
                <p
                  key={i}
                  className="text-foreground/90 text-[0.9rem] leading-relaxed mt-4 first:mt-0"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Key points */}
            <section className="bg-surface-container-high ghost-border p-6 rounded-[1.5rem] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-muted-foreground font-bold text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
                <Icon name="key" filled className="text-primary" size={18} />
                Key Points
              </h3>
              <ul className="space-y-4 relative z-10">
                {chapter.keyPoints.map((k) => (
                  <li key={k.title} className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary glow-soft flex-shrink-0" />
                    <div>
                      <strong className="text-foreground block mb-0.5 text-sm">
                        {k.title}
                        {k.description ? ":" : ""}
                      </strong>
                      {k.description && (
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {k.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Daleel insight */}
            <aside className="relative pl-6 py-3 bg-surface-container rounded-r-2xl">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary glow-soft rounded-full" />
              <div className="flex items-start gap-3">
                <Icon name="format_quote" filled className="text-primary opacity-80" size={22} />
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.25em] text-primary mb-2 font-semibold">
                    Daleel's Insight
                  </span>
                  <blockquote className="font-serif italic text-base leading-relaxed text-foreground/90">
                    {chapter.daleelInsight}
                  </blockquote>
                </div>
              </div>
            </aside>

            {/* Back to chapter */}
            <Link
              to={`/journey/${chapter.id}`}
              className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] font-semibold hover:text-primary-glow"
            >
              <Icon name="arrow_back" size={16} /> Back to Chapter
            </Link>
          </article>
        </div>
      </main>
    </div>
  );
};

export default ArchiveDetail;
