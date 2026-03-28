import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getPhase } from "../utils/insight-helper";
import { getPhaseBriefContent } from "../data/phaseBriefContent";
import { useNavbarVisibility } from "../context/NavbarVisibilityContext";

type BriefLocationState = {
  phase?: string;
};

export default function BriefPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hideNavbar, showNavbar } = useNavbarVisibility();
  const state = location.state as BriefLocationState | null;
  const phase = state?.phase ?? getPhase(new Date());
  const content = getPhaseBriefContent(phase);

  useEffect(() => {
    hideNavbar();
    return () => showNavbar();
  }, [hideNavbar, showNavbar]);

  return (
    <div className="min-h-full bg-[#FFF0ED] pb-10 font-sans text-[#111111]">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-black/[0.06] bg-[#FFF0ED]/60 px-5 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF8A80] text-white shadow-sm"
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-lg font-bold text-[#111111]">Phase Overview</h1>
      </header>

      <div className="px-5 pt-6">
        <div
          className="relative overflow-hidden rounded-[1.75rem] px-6 py-8 shadow-sm"
          style={{
            background: `linear-gradient(to bottom, ${content.cardGradient.from}, ${content.cardGradient.to})`,
          }}
        >
          <div className="relative max-w-[85%] text-left">
            <h2 className="text-2xl font-bold tracking-tight">{content.heroTitle}</h2>
            <p className="mt-1 text-base font-medium text-[#111111]/85">{content.heroSubtitle}</p>
          </div>
          <div
            className="pointer-events-none absolute -right-4 bottom-0 top-0 h-full w-28 opacity-90"
            aria-hidden
          >
            <div className="h-full w-full rounded-full bg-gradient-to-b from-[#FFAB91]/40 to-[#E57373]/30 blur-2xl" />
          </div>
        </div>

        <p className="mt-8 text-base leading-relaxed text-[#111111]/90">{content.intro}</p>

        <div className="mt-8 flex flex-col gap-8">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-lg font-bold text-[#FF6961]">{section.title}</h3>
              {section.bullets && (
                <ul className="mt-4 flex list-none flex-col gap-4 pl-0">
                  {section.bullets.map((item) => (
                    <li key={item.label} className="text-base leading-relaxed text-[#111111]/88">
                      <span className="font-semibold text-[#111111]">{item.label}: </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
              {section.paragraph && (
                <p className="mt-4 text-base leading-relaxed text-[#111111]/88">{section.paragraph}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
