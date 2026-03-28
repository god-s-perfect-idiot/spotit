import { ChevronRight, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "../../components/profile/ProfileCard";
import Goal from "../../components/profile/Goal";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

const DARK_PREF_KEY = "spotit-dark-mode";

function SettingsToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-[15px] font-semibold text-[#1a1112]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-[#ff6961]" : "bg-white/60 ring-2 ring-[#ff6961]/35"
          }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"
            }`}
        />
      </button>
    </div>
  );
}

function SettingsLinkRow({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-row items-center justify-between gap-3 py-3 text-[15px] font-semibold text-[#1a1112] first:pt-0 last:pb-0"
    >
      <span>{label}</span>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#4a3d3f]/55" />
    </Link>
  );
}

function HubLinkRow({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-row items-center justify-between gap-1 py-3.5 text-[15px] font-semibold text-[#1a1112] first:pt-0 last:pb-0"
    >
      <span>{label}</span>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#4a3d3f]/55" />
    </Link>
  );
}

export default function ProfileHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [darkOn, setDarkOn] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  useEffect(() => {
    try {
      const v = localStorage.getItem(DARK_PREF_KEY);
      const on = v === "1";
      setDarkOn(on);
      document.documentElement.classList.toggle("dark", on);
    } catch {
      /* ignore */
    }
  }, []);

  const applyDark = useCallback((next: boolean) => {
    setDarkOn(next);
    try {
      localStorage.setItem(DARK_PREF_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", next);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5 p-6 pb-28">
      <h1 className="text-2xl font-bold tracking-tight text-[#1a1112]">Profile</h1>

      <ProfileCard />

      <Goal />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-[#1a1112]">Health Hub</h2>
        <div className="bg-[#F9D1CD] flex flex-col rounded-3xl px-4 py-4">
          <HubLinkRow to="/profile/contraception" label="Contraception Hub" />
          <HubLinkRow to="/profile/appointments" label="Appointment Tracking" />
          <HubLinkRow to="/profile/cycle-details" label="Cycle Details" />
          <HubLinkRow to="/profile/health-report" label="Download Report" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-[#1a1112]">Settings</h2>
        <div className="bg-[#F9D1CD] flex flex-col rounded-3xl px-4 py-4">
          <SettingsToggleRow label="Dark Mode" checked={darkOn} onChange={applyDark} />
          <SettingsLinkRow to="/profile/settings/hide-content" label="Hide Content" />
          <SettingsLinkRow to="/profile/settings/privacy" label="Privacy Settings" />
          <SettingsLinkRow to="/profile/settings/notifications" label="Notification Settings" />
          <SettingsLinkRow to="/profile/settings/help" label="Help & FAQs" />
        </div>
      </section>

      <p className="text-center text-sm text-[#c44a42]">
        <button type="button" className="font-medium underline decoration-[#c44a42]/40">
          Privacy Policy
        </button>
        <span className="mx-1 text-[#4a3d3f]/45">·</span>
        <button type="button" className="font-medium underline decoration-[#c44a42]/40">
          Terms of Use
        </button>
      </p>

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="bg-[#F9D1CD] flex flex-row items-center justify-center gap-2 rounded-3xl py-4 text-[15px] font-semibold text-red-600 transition-colors hover:bg-red-500/10"
      >
        Logout
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}
