import { Calendar, Pencil } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";
import { ProfileInputShell, ProfileLabeledField } from "../../components/profile/ProfileLabeledField";
import { PROFILE_TOPICS_OF_INTEREST } from "../../data/profileTopics";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import { formatLongDate } from "../../utils/profileFormat";

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function PersonalDetailsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState("");
  const [birthInput, setBirthInput] = useState("");
  const [phone, setPhone] = useState("");
  const [topics, setTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    setName(user?.name || user?.displayName || "");
    setPhone(user?.phone || "");
    if (user?.birthdate && !Number.isNaN(new Date(user.birthdate).getTime())) {
      setBirthInput(toDateInputValue(new Date(user.birthdate)));
    } else {
      setBirthInput("");
    }
    setTopics(new Set(user?.topicsOfInterest ?? []));
  }, [user]);

  const birthDate = useMemo(() => {
    if (!birthInput) return null;
    const d = new Date(birthInput + "T12:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  }, [birthInput]);

  const persistProfile = useCallback(async () => {
    if (!user) return;
    await dispatch(
      updateUser({
        name: name.trim() || user.name,
        birthdate: birthDate ?? undefined,
        phone: phone.trim() || undefined,
        topicsOfInterest: Array.from(topics),
      }),
    ).unwrap();
  }, [dispatch, user, name, birthDate, phone, topics]);

  const toggleTopic = (t: string) => {
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const skipSave = useRef(true);
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      void persistProfile().catch(() => {});
    }, 500);
    return () => window.clearTimeout(id);
  }, [name, birthInput, phone, topics, persistProfile]);

  const email = user?.email ?? "";

  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <div className="flex flex-col gap-4">
        <ProfilePageHeader title="Personal Details" />
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-[5.5rem] w-[5.5rem] rounded-2xl bg-white" />
            <button
              type="button"
              className="bg-[#FF6961] text-white shadow-md absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full shadow-md"
              aria-label="Edit photo"
            >
              <Pencil className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#1a1112]">Personal Details</h2>

        <ProfileLabeledField label="Name">
          <ProfileInputShell className="gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
            />
            <span className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Date of Birth">
          <ProfileInputShell className="gap-2">
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[#1a1112]">
              {birthDate ? formatLongDate(birthDate) : "Select date"}
            </span>
            <label className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full">
              <Calendar className="h-4 w-4 text-white" />
              <input
                type="date"
                value={birthInput}
                onChange={(e) => setBirthInput(e.target.value)}
                className="sr-only"
              />
            </label>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Email Id">
          <ProfileInputShell className="gap-2">
            <input
              value={email}
              readOnly
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#4a3d3f]/75 outline-none"
            />
            <span className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full opacity-50">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          </ProfileInputShell>
        </ProfileLabeledField>

        <ProfileLabeledField label="Mobile Number">
          <ProfileInputShell className="gap-2">
            <span className="shrink-0 text-[15px] font-semibold text-[#1a1112]">+91</span>
            <span className="text-[#4a3d3f]/35">|</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 12))}
              inputMode="numeric"
              placeholder="Phone number"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#1a1112] outline-none"
            />
            <span className="bg-[#FF6961] text-white shadow-md flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Pencil className="h-4 w-4 text-white" />
            </span>
          </ProfileInputShell>
        </ProfileLabeledField>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[#1a1112]">Topics of Interest</h2>
        <div className="bg-[#FFD7D7] rounded-3xl p-4">
          <div className="flex flex-wrap gap-2">
            {PROFILE_TOPICS_OF_INTEREST.map((topic) => {
              const on = topics.has(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border-2 px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    on ? "border-[#33B1FF] bg-[#33B1FF] text-white border-transparent" : "border border-[#33B1FF] bg-white text-[#33B1FF]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
