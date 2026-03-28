import { ChevronLeft, ChevronRight, Droplet } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";

const LS_KEY = "spotit-cycle-details-ui";

type LocalUi = {
  periodLength: number;
  periodUnsure: boolean;
  flowIntensity: number;
  regularity: "regular" | "irregular" | "unsure" | null;
};

const defaultLocal: LocalUi = {
  periodLength: 7,
  periodUnsure: false,
  flowIntensity: 3,
  regularity: "regular",
};

function loadLocal(): LocalUi {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultLocal;
    return { ...defaultLocal, ...JSON.parse(raw) };
  } catch {
    return defaultLocal;
  }
}

function saveLocal(s: LocalUi) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

type PreId = "pcos" | "endometriosis" | "fibroids" | "hypothyroidism";

const CONDITION_ROWS: { id: PreId | "pmdd"; label: string; kind: "pre" | "pmdd" }[] = [
  { id: "pcos", label: "PCOS", kind: "pre" },
  { id: "endometriosis", label: "Endometriosis", kind: "pre" },
  { id: "fibroids", label: "Fibroids", kind: "pre" },
  { id: "hypothyroidism", label: "Thyroid Issues", kind: "pre" },
  { id: "pmdd", label: "PMDD", kind: "pmdd" },
];

export default function CycleDetailsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [local, setLocal] = useState<LocalUi>(loadLocal);
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  const cycleUnsure = user?.cycleLength === null;
  const cycleLength = user?.cycleLength ?? 28;

  useEffect(() => {
    saveLocal(local);
  }, [local]);

  const predefined = useMemo(
    () => new Set(user?.healthConditions?.predefined ?? []),
    [user?.healthConditions?.predefined],
  );
  const custom = useMemo(() => user?.healthConditions?.custom ?? [], [user?.healthConditions?.custom]);

  const setCycleLength = useCallback(
    (next: number | null) => {
      void dispatch(updateUser({ cycleLength: next })).unwrap().catch(() => {});
    },
    [dispatch],
  );

  const bumpCycle = useCallback(
    (delta: number) => {
      const base = cycleUnsure ? 28 : (user?.cycleLength ?? 28);
      const next = Math.min(45, Math.max(21, base + delta));
      setCycleLength(next);
    },
    [cycleUnsure, user?.cycleLength, setCycleLength],
  );

  const persistHealth = useCallback(
    (pre: string[], cust: string[]) => {
      void dispatch(updateUser({ healthConditions: { predefined: pre, custom: cust } }))
        .unwrap()
        .catch(() => {});
    },
    [dispatch],
  );

  const toggleCondition = (id: PreId | "pmdd", kind: "pre" | "pmdd") => {
    const pre = new Set(predefined);
    const cust = [...custom];
    if (kind === "pre") {
      if (pre.has(id)) pre.delete(id);
      else pre.add(id as PreId);
      persistHealth(Array.from(pre), cust);
    } else {
      const label = "PMDD";
      const idx = cust.findIndex((c) => c.toLowerCase() === label.toLowerCase());
      if (idx >= 0) cust.splice(idx, 1);
      else cust.push(label);
      persistHealth(Array.from(pre), cust);
    }
  };

  const addOtherCondition = () => {
    const t = otherText.trim();
    if (!t) return;
    const pre = Array.from(predefined);
    const cust = [...custom, t];
    setOtherText("");
    setShowOther(false);
    persistHealth(pre, cust);
  };

  const isPmdSelected = custom.some((c) => c.toLowerCase() === "pmdd");

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <ProfilePageHeader title="Cycle Details" />

      <section className="flex flex-col gap-2">
        <ProfileLabeledField label="Average Cycle Length">
          <div className="flex flex-row items-center gap-0 rounded-full border border-[#FF6961] border-2 bg-white py-1 pl-1 pr-1 shadow-sm">
            <button
              type="button"
              onClick={() => bumpCycle(-1)}
              className="bg-[#FF6961] text-white shadow-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              aria-label="Decrease cycle length"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <span className="min-w-0 flex-1 text-center text-[15px] font-semibold text-[#1a1112]">
              {cycleUnsure ? "Not set" : `${cycleLength} days`}
            </span>
            <button
              type="button"
              onClick={() => bumpCycle(1)}
              className="bg-[#FF6961] text-white shadow-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              aria-label="Increase cycle length"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setCycleLength(null)}
            className="border-2 border-[#FF6961] bg-white mt-2 w-full rounded-full py-3 text-sm font-semibold text-[#1a1112]"
          >
            I am not sure
          </button>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-2">
        <ProfileLabeledField label="Average Period Length">
          <div className="flex flex-row items-center gap-0 rounded-full border border-[#FF6961] border-2 bg-white py-1 pl-1 pr-1 shadow-sm">
            <button
              type="button"
              disabled={local.periodUnsure}
              onClick={() =>
                setLocal((s) => ({
                  ...s,
                  periodLength: Math.max(2, s.periodLength - 1),
                  periodUnsure: false,
                }))
              }
              className="bg-[#FF6961] text-white shadow-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-35"
              aria-label="Decrease period length"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <span className="min-w-0 flex-1 text-center text-[15px] font-semibold text-[#1a1112]">
              {local.periodUnsure ? "Not set" : `${local.periodLength} days`}
            </span>
            <button
              type="button"
              disabled={local.periodUnsure}
              onClick={() =>
                setLocal((s) => ({
                  ...s,
                  periodLength: Math.min(14, s.periodLength + 1),
                  periodUnsure: false,
                }))
              }
              className="bg-[#FF6961] text-white shadow-md flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-35"
              aria-label="Increase period length"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setLocal((s) => ({ ...s, periodUnsure: true }))}
            className="border-2 border-[#FF6961] bg-white mt-2 w-full rounded-full py-3 text-sm font-semibold text-[#1a1112]"
          >
            I am not sure
          </button>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-3">
        <ProfileLabeledField label="Flow Intensity">
          <div className="flex flex-row justify-between gap-1 px-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocal((s) => ({ ...s, flowIntensity: n }))}
                className="flex flex-1 flex-col items-center gap-1 p-1"
                aria-label={`Flow level ${n}`}
              >
                <Droplet
                  className={`h-14 w-14 transition-colors ${
                    n <= local.flowIntensity
                      ? "fill-[#ff6961] text-[#ff6961]"
                      : "fill-transparent text-[#ff6961]/45"
                  }`}
                  strokeWidth={1.75}
                />
              </button>
            ))}
          </div>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-2">
        <ProfileLabeledField label="Cycle Regularity">
          <div className="flex flex-col gap-2">
            {(
              [
                { v: "regular" as const, label: "Regular" },
                { v: "irregular" as const, label: "Irregular" },
                { v: "unsure" as const, label: "Not Sure" },
              ] as const
            ).map(({ v, label }) => {
              const on = local.regularity === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setLocal((s) => ({ ...s, regularity: v }))}
                  className={`w-full rounded-full border-2 py-3.5 text-center text-[15px] font-semibold transition-colors ${
                    on ? "bg-[#FF6961] text-white shadow-md" : "border-2 border-[#FF6961] bg-white text-[#1a1112]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-2">
        <ProfileLabeledField label="Diagnosed Conditions">
          <div className="flex flex-col gap-2">
            {CONDITION_ROWS.map((row) => {
              const on =
                row.kind === "pre"
                  ? predefined.has(row.id)
                  : row.id === "pmdd" && isPmdSelected;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => toggleCondition(row.id, row.kind)}
                  className={`w-full rounded-full border-2 py-3.5 text-center text-[15px] font-semibold transition-colors ${
                    on ? "bg-[#FF6961] text-white shadow-md" : "border-2 border-[#FF6961] bg-white text-[#1a1112]"
                  }`}
                >
                  {row.label}
                </button>
              );
            })}

            {custom
              .filter((c) => c.toLowerCase() !== "pmdd")
              .map((c) => (
                <div
                  key={c}
                  className="border-2 border-[#FF6961] bg-white flex w-full items-center justify-between rounded-full px-4 py-3.5 text-[15px] font-semibold text-[#1a1112]"
                >
                  {c}
                </div>
              ))}

            {showOther ? (
              <div className="flex flex-col gap-2">
                <input
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Condition name"
                  className="border border-[#FF8D7B] bg-white rounded-2xl px-4 py-3 text-[15px] font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={addOtherCondition}
                  className="rounded-full bg-[#FF6961] py-3 text-sm font-semibold text-white shadow-md"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowOther(true)}
                className="w-full rounded-full border-2 border-dashed border-[#FF6961] bg-white py-3.5 text-center text-[15px] font-semibold text-[#4a3d3f]/65"
              >
                + Add other conditions
              </button>
            )}
          </div>
        </ProfileLabeledField>
      </section>
    </div>
  );
}
