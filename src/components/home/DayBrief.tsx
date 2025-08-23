import { useEffect, useState } from "react";
import { getPhase, getPhaseColor } from "../../utils/insight-helper";

export default function DayBrief() {
  const [briefTitle, setBriefTitle] = useState<string>("");
  const [phase, setPhase] = useState<string>("");
  const [insight, setInsight] = useState<string>("");
  // phase colors to be:
  // luteal phase: #FF8A65
  // menstruation: #D32F2F
  // follicular phase: #FF8C94
  // ovulation: #FFEB3B
  const [phaseColor, setPhaseColor] = useState<string>("");

  useEffect(() => {
    setBriefTitle("Period in 3 days");
    const currentPhase = getPhase(new Date());
    setPhase(currentPhase); 
    setPhaseColor(getPhaseColor(currentPhase));
    setInsight(
      "You’re in the second half of your cycle. Progesterone is rising, which can bring calm energy but also a touch of fatigue. Listen to your body and slow things down if you need."
    );
  }, []);

  return (
    // linear gradient from fff to ff8a65
    <div
      className={`flex flex-col gap-2 text-center p-6 border-2 rounded-[3rem]`}
      style={{
        background: `linear-gradient(to bottom, #ffffff, ${phaseColor})`,
        borderColor: phaseColor,
      }}
    >
      <span className="text-2xl font-bold">{briefTitle}</span>
      <span className="text-base font-medium">{phase}</span>
      <span className="text-base leading-tight">{insight}</span>
    </div>
  );
}
