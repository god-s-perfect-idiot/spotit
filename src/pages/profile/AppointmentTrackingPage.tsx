import { Calendar, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileInputShell, ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { ADVANCE_REMINDER_OPTIONS } from "../../data/profileTopics";
import { formatLongDate } from "../../utils/profileFormat";

const LS_KEY = "spotit-appointment-tracking";

type AppointmentState = {
  concern: string;
  upcomingDate: string;
  calMonth: number;
  calYear: number;
  pastIsoDates: string[];
  showLogForm: boolean;
  logConcern: string;
  logDate: string;
  logReminderTime: string;
  logReminderAdvance: string;
};

const defaultState: AppointmentState = {
  concern: "Depo-Provera Injection",
  upcomingDate: "2026-02-08",
  calMonth: 10,
  calYear: 2025,
  pastIsoDates: ["2025-11-16"],
  showLogForm: false,
  logConcern: "Irregular Period",
  logDate: "2026-11-25",
  logReminderTime: "08:00",
  logReminderAdvance: "1 day before",
};

function loadState(): AppointmentState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function saveState(s: AppointmentState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isoFromYmd(y: number, m0: number, day: number): string {
  const mm = String(m0 + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function CalendarGrid({
  month,
  year,
  highlightIso,
  markedSet,
  onPickDay,
}: {
  month: number;
  year: number;
  highlightIso: string | null;
  markedSet: Set<string>;
  onPickDay: (iso: string) => void;
}) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null)];
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
        <div key={d} className="py-1 text-xs font-bold text-[#4a3d3f]/65">
          {d}
        </div>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <div key={`e-${i}`} className="h-9" />;
        const iso = isoFromYmd(year, month, day);
        const isMark = markedSet.has(iso);
        const isHi = highlightIso === iso;
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onPickDay(iso)}
            className={`flex h-9 w-9 items-center justify-center justify-self-center rounded-full text-[13px] font-semibold transition-colors ${
              isHi
                ? "bg-[#ff6961] text-white shadow-md"
                : isMark
                  ? "bg-[#ff6961]/25 text-[#1a1112]"
                  : "text-[#1a1112] hover:bg-white/40"
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

export default function AppointmentTrackingPage() {
  const [state, setState] = useState<AppointmentState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const set = (patch: Partial<AppointmentState>) => setState((prev) => ({ ...prev, ...patch }));

  const upcoming = state.upcomingDate ? new Date(state.upcomingDate + "T12:00:00") : null;
  const markedSet = useMemo(() => new Set(state.pastIsoDates), [state.pastIsoDates]);

  const primaryHighlight =
    state.showLogForm && state.logDate ? state.logDate : state.pastIsoDates[0] ?? null;

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => y - 3 + i);
  }, []);

  const handleLogDone = () => {
    const next = new Set(state.pastIsoDates);
    if (state.logDate) next.add(state.logDate);
    set({
      pastIsoDates: Array.from(next),
      showLogForm: false,
      concern: state.logConcern || state.concern,
      upcomingDate: state.logDate || state.upcomingDate,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <ProfilePageHeader title="Tracking History" />

      <section className="flex flex-col gap-4">
        <ProfileLabeledField label="Concern">
          <ProfileInputShell className="gap-2">
            <input
              value={state.concern}
              onChange={(e) => set({ concern: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
            />
            <span className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full pointer-events-none">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Upcoming Appointment Date">
          <ProfileInputShell className="gap-2">
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1a1112]">
              {upcoming && !Number.isNaN(upcoming.getTime()) ? formatLongDate(upcoming) : "—"}
            </span>
            <label className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
              <Calendar className="h-4 w-4 text-white" />
              <input
                type="date"
                value={state.upcomingDate}
                onChange={(e) => set({ upcomingDate: e.target.value })}
                className="sr-only"
              />
            </label>
          </ProfileInputShell>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#1a1112]">Past Appointments</h2>
        <div className="bg-[#FFD7D7] rounded-3xl p-4">
          <div className="mb-4 flex gap-2">
            <ProfileInputShell className="min-h-0 flex-1 py-1.5">
              <select
                value={state.calMonth}
                onChange={(e) => set({ calMonth: Number(e.target.value) })}
                className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[#1a1112] outline-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </ProfileInputShell>
            <ProfileInputShell className="min-h-0 w-[5.5rem] py-1.5">
              <select
                value={state.calYear}
                onChange={(e) => set({ calYear: Number(e.target.value) })}
                className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[#1a1112] outline-none"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </ProfileInputShell>
          </div>

          <CalendarGrid
            month={state.calMonth}
            year={state.calYear}
            highlightIso={primaryHighlight}
            markedSet={markedSet}
            onPickDay={(iso) => {
              if (state.showLogForm) set({ logDate: iso });
            }}
          />
        </div>

        {!state.showLogForm ? (
          <button
            type="button"
            onClick={() => set({ showLogForm: true })}
            className="border-2 border-[#FF6961] bg-white rounded-full py-3.5 text-center text-[15px] font-bold text-[#c44a42]"
          >
            Log New Appointment
          </button>
        ) : null}
      </section>

      {state.showLogForm ? (
        <section className="flex flex-col gap-5 border-t border-white/35 pt-2">
          <ProfileLabeledField label="Concern">
            <ProfileInputShell>
              <input
                value={state.logConcern}
                onChange={(e) => set({ logConcern: e.target.value })}
                className="w-full bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
              />
            </ProfileInputShell>
          </ProfileLabeledField>

          <ProfileLabeledField label="Appointment Date">
            <ProfileInputShell className="gap-2">
              <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1a1112]">
                {state.logDate
                  ? formatLongDate(new Date(state.logDate + "T12:00:00"))
                  : "Select date"}
              </span>
              <label className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
                <Calendar className="h-4 w-4 text-white" />
                <input
                  type="date"
                  value={state.logDate}
                  onChange={(e) => set({ logDate: e.target.value })}
                  className="sr-only"
                />
              </label>
            </ProfileInputShell>
          </ProfileLabeledField>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#1a1112]">Appointment Reminders</h3>
            <ProfileLabeledField label="Reminder Time">
              <ProfileInputShell>
                <input
                  type="time"
                  value={state.logReminderTime}
                  onChange={(e) => set({ logReminderTime: e.target.value })}
                  className="w-full bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
                />
              </ProfileInputShell>
            </ProfileLabeledField>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-[#4a3d3f]/72">
                How far in advance should we start reminding you?
              </span>
              <div className="bg-[#FFD7D7] rounded-3xl p-4">
                <div className="grid grid-cols-2 gap-2">
                  {ADVANCE_REMINDER_OPTIONS.map((opt) => {
                    const on = state.logReminderAdvance === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set({ logReminderAdvance: opt })}
                        className={`rounded-full border-2 px-3 py-2.5 text-center text-xs font-semibold transition-colors ${
                          on ? "border-[#33B1FF] bg-[#33B1FF] text-white border-transparent" : "border border-[#33B1FF] bg-white text-[#33B1FF]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogDone}
            className="rounded-full bg-[#FF6961] py-3.5 text-center text-[15px] font-bold text-white shadow-md"
          >
            Done
          </button>
        </section>
      ) : null}
    </div>
  );
}
