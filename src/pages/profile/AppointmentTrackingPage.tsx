import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "../../components/ui-kit/DatePicker";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileInputShell, ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { ADVANCE_REMINDER_OPTIONS } from "../../data/profileTopics";
import { formatLongDate } from "../../utils/profileFormat";

const LS_KEY = "spotit-appointment-tracking";

type AppointmentState = {
  concern: string;
  upcomingDate: string;
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
  pastIsoDates: ["2025-11-16"],
  showLogForm: false,
  logConcern: "Irregular Period",
  logDate: "2026-11-25",
  logReminderTime: "08:00",
  logReminderAdvance: "1 day before",
};

function parseIsoDate(iso: string): Date {
  if (!iso) return new Date();
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function dateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadState(): AppointmentState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppointmentState>;
    return { ...defaultState, ...parsed };
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

export default function AppointmentTrackingPage() {
  const [state, setState] = useState<AppointmentState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const set = (patch: Partial<AppointmentState>) => setState((prev) => ({ ...prev, ...patch }));

  const yNow = new Date().getFullYear();

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

  const sortedPast = [...state.pastIsoDates].sort();

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
          <DatePicker
            value={parseIsoDate(state.upcomingDate)}
            onChange={(d) => set({ upcomingDate: dateToIso(d) })}
            minYear={yNow - 10}
            maxYear={yNow + 5}
            className="w-full"
          />
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#1a1112]">Past Appointments</h2>
        {sortedPast.length > 0 ? (
          <ul className="flex flex-col gap-2 rounded-3xl bg-[#FFD7D7] px-4 py-3">
            {sortedPast.map((iso) => (
              <li key={iso} className="text-[15px] font-medium text-[#1a1112]">
                {formatLongDate(parseIsoDate(iso))}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl bg-[#FFD7D7] px-4 py-3 text-sm font-medium text-[#4a3d3f]/80">
            No past appointments logged yet.
          </p>
        )}

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
            <DatePicker
              value={parseIsoDate(state.logDate)}
              onChange={(d) => set({ logDate: dateToIso(d) })}
              minYear={yNow - 10}
              maxYear={yNow + 5}
              markedIsoDates={state.pastIsoDates}
              showTextSummary={false}
              calendarClassName="bg-[#FFD7D7]"
              className="w-full"
            />
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
