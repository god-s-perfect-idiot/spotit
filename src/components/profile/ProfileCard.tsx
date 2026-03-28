import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { ageFromBirthdate } from "../../utils/profileFormat";

export default function ProfileCard() {
  const user = useAppSelector((s) => s.auth.user);
  const name = user?.name || user?.displayName || "Your name";
  const email = user?.email ?? "";
  const age = ageFromBirthdate(user?.birthdate);

  return (
    <Link
      to="/profile/personal-details"
      className="flex w-full flex-row items-center justify-between gap-4 rounded-2xl bg-[#F9D1CD] p-4 transition-opacity active:opacity-90"
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
        <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl bg-white" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-base font-bold text-[#1a1112]">{name}</span>
          <span className="text-sm font-medium text-[#4a3d3f]/85">
            {age !== null ? `${age} Years Old` : "Add your birthdate"}
          </span>
          <span className="truncate text-sm font-medium text-[#4a3d3f]/75">{email}</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#4a3d3f]/55" aria-hidden />
    </Link>
  );
}
