import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileInputShell, ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { useToast } from "../../components/ui-kit/ToastProvider";
import { HEALTH_REPORT_TIMEFRAMES } from "../../data/profileTopics";

const LS_KEY = "spotit-health-report";

type ReportState = {
  timeframe: string;
  cycleDates: boolean;
  flow: boolean;
  symptomsMood: boolean;
  intimacy: boolean;
  medications: boolean;
};

const defaultState: ReportState = {
  timeframe: "Last month",
  cycleDates: true,
  flow: true,
  symptomsMood: true,
  intimacy: true,
  medications: true,
};

function load(): ReportState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function save(s: ReportState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const ROWS: { key: keyof ReportState; label: string }[] = [
  { key: "cycleDates", label: "Cycle Dates" },
  { key: "flow", label: "Flow" },
  { key: "symptomsMood", label: "Symptoms & Mood" },
  { key: "intimacy", label: "Intimacy & Libido" },
  { key: "medications", label: "Medications & Notes" },
];

function ToggleRow({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 py-3 first:pt-1">
      <span className="text-[15px] font-semibold text-[#1a1112]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          on ? "bg-[#ff6961]" : "bg-white/60 ring-2 ring-[#ff6961]/35"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function HealthReportPage() {
  const { showToast } = useToast();
  const [state, setState] = useState<ReportState>(load);

  useEffect(() => {
    save(state);
  }, [state]);

  const set = (patch: Partial<ReportState>) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <ProfilePageHeader title="Health Report" />

      <ProfileLabeledField label="Timeframe">
        <ProfileInputShell className="gap-2">
          <select
            value={state.timeframe}
            onChange={(e) => set({ timeframe: e.target.value })}
            className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
          >
            {HEALTH_REPORT_TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="bg-[#FF6961] text-white shadow-md pointer-events-none flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <Pencil className="h-4 w-4 text-white" />
          </span>
        </ProfileInputShell>
      </ProfileLabeledField>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[#4a3d3f]/72">Data Selection</span>
        <div className="bg-[#FFD7D7] rounded-3xl px-3 py-1">
          {ROWS.map(({ key, label }) => (
            <ToggleRow
              key={key}
              label={label}
              on={Boolean(state[key])}
              onChange={() => set({ [key]: !state[key] } as Partial<ReportState>)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => showToast("Your PDF report will be available soon.", "success")}
        className="rounded-full bg-[#FF6961] py-3.5 text-center text-[15px] font-bold text-white shadow-md"
      >
        Download PDF
      </button>
    </div>
  );
}
