export const getPhaseColor = (phase: string) => {
  switch (phase) {
    case "Luteal Phase":
      return "#FF8A65";
    case "Follicular Phase":
      return "#FF8C94";
    case "Ovulation":
      return "#FFEB3B";
    case "Menstruation":
      return "#D32F2F";
    default:
      return "#FFFFFF";
  }
};

export const getPhase = (date: Date) => {
    // TODO: get phase from backend
    const phases = ["Luteal Phase", "Follicular Phase", "Ovulation", "Menstruation"];
    const phase = phases[Math.floor(Math.random() * phases.length)];
    return phase;
};