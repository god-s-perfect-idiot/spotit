import { Calendar, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileInputShell, ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { ADVANCE_REMINDER_OPTIONS, CONTRACEPTION_METHODS } from "../../data/profileTopics";
import { formatLongDate } from "../../utils/profileFormat";

const LS_KEY = "spotit-contraception-hub";

type ContraceptionState = {
  method: string;
  lastAppointment: string;
  nextAppointment: string;
  reminderTime: string;
  reminderAdvance: string;
};

const defaultState: ContraceptionState = {
  method: "Depo-Provera Injection",
  lastAppointment: "2025-11-16",
  nextAppointment: "2026-02-08",
  reminderTime: "08:00",
  reminderAdvance: "1 day before",
};

function loadState(): ContraceptionState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    const p = JSON.parse(raw) as Partial<ContraceptionState>;
    return { ...defaultState, ...p };
  } catch {
    return defaultState;
  }
}

function saveState(s: ContraceptionState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export default function ContraceptionHubPage() {
  const [state, setState] = useState<ContraceptionState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const set = (patch: Partial<ContraceptionState>) => setState((prev) => ({ ...prev, ...patch }));

  const lastD = state.lastAppointment ? new Date(state.lastAppointment + "T12:00:00") : null;
  const nextD = state.nextAppointment ? new Date(state.nextAppointment + "T12:00:00") : null;

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <ProfilePageHeader title="Contraception Hub" />

      <section className="flex flex-col gap-4">
        <ProfileLabeledField label="Current Method">
          <ProfileInputShell className="gap-2">
            <select
              value={state.method}
              onChange={(e) => set({ method: e.target.value })}
              className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
            >
              {CONTRACEPTION_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full pointer-events-none">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Last Appointment">
          <ProfileInputShell className="gap-2">
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1a1112]">
              {lastD && !Number.isNaN(lastD.getTime()) ? formatLongDate(lastD) : "—"}
            </span>
            <label className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
              <Calendar className="h-4 w-4 text-white" />
              <input
                type="date"
                value={state.lastAppointment}
                onChange={(e) => set({ lastAppointment: e.target.value })}
                className="sr-only"
              />
            </label>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Next Appointment">
          <ProfileInputShell className="gap-2">
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1a1112]">
              {nextD && !Number.isNaN(nextD.getTime()) ? formatLongDate(nextD) : "—"}
            </span>
            <label className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
              <Calendar className="h-4 w-4 text-white" />
              <input
                type="date"
                value={state.nextAppointment}
                onChange={(e) => set({ nextAppointment: e.target.value })}
                className="sr-only"
              />
            </label>
          </ProfileInputShell>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#1a1112]">Contraception Reminders</h2>

        <ProfileLabeledField label="Reminder Time">
          <ProfileInputShell>
            <input
              type="time"
              value={state.reminderTime}
              onChange={(e) => set({ reminderTime: e.target.value })}
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
                const on = state.reminderAdvance === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set({ reminderAdvance: opt })}
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
      </section>
    </div>
  );
}
