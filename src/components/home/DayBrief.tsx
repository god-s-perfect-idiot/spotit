import { useEffect, useState } from "react";
import { getPhase, getPhaseColor } from "../../utils/insight-helper";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DayBrief() {
  const [briefTitle, setBriefTitle] = useState<string>("");
  const [phase, setPhase] = useState<string>(() => getPhase(new Date()));
  const [insight, setInsight] = useState<string>("");
  const navigate = useNavigate();
  // phase colors to be:
  // luteal phase: #FF8A65
  // menstruation: #D32F2F
  // follicular phase: #FF8C94
  // ovulation: #FFEB3B
  const phaseColor = getPhaseColor(phase);

  useEffect(() => {
    setBriefTitle("Period in 3 days");
    const currentPhase = getPhase(new Date());
    setPhase(currentPhase);
    setInsight(
      "You’re in the second half of your cycle. Progesterone is rising, which can bring calm energy but also a touch of fatigue. Listen to your body and slow things down if you need."
    );
  }, []);

  return (
    // linear gradient from fff to ff8a65
    <div
      className={`relative flex cursor-pointer flex-col gap-2 text-center p-6 border-2 rounded-[3rem]`}
      style={{
        background: `linear-gradient(to bottom, #ffffff, ${phaseColor})`,
        borderColor: phaseColor,
      }}
      onClick={() => navigate('/brief-page', { state: { phase } })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/brief-page', { state: { phase } });
        }
      }}
    >
      <button
        type="button"
        className="absolute top-2 right-2 p-4"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/brief-page', { state: { phase } });
        }}
        aria-label="Phase overview"
      >
        <Info size={20} />
      </button>
      <span className="text-2xl font-bold">{briefTitle}</span>
      <span className="text-base font-medium">{phase}</span>
      <span className="text-base leading-tight">{insight}</span>
    </div>
  );
}
