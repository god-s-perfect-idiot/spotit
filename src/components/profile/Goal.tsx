import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";

type GoalValue = "track-cycle" | "get-pregnant" | "track-pregnancy";

const GOALS: { value: GoalValue; label: string }[] = [
  { value: "track-cycle", label: "Track Cycle" },
  { value: "get-pregnant", label: "Get Pregnant" },
  { value: "track-pregnancy", label: "Track Pregnancy" },
];

export default function Goal() {
  const dispatch = useAppDispatch();
  const stored = useAppSelector((s) => s.auth.user?.goal);
  const active: GoalValue =
    stored === "get-pregnant" || stored === "track-pregnancy" ? stored : "track-cycle";

  const handleGoal = (goal: GoalValue) => {
    void dispatch(updateUser({ goal })).unwrap().catch(() => {
      /* optional toast */
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-lg font-bold text-[#1a1112]">My Goal</span>
      <div className="-mx-1 flex flex-row gap-2 overflow-x-auto pb-1">
        {GOALS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleGoal(value)}
            className={`shrink-0 transform rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 ${
              active === value
                ? "bg-[#FF6961] text-white shadow-lg"
                : "border-2 border-[#FF6961] bg-white text-black hover:border-[#FF6961] hover:bg-[#FF6961] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
