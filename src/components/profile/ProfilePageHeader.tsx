import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProfilePageHeaderProps = {
  title: string;
  /** Defaults to /profile */
  backTo?: string;
};

export function ProfilePageHeader({ title, backTo = "/profile" }: ProfilePageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6961] text-white shadow-md transition-transform active:scale-95"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
      </button>
      <h1 className="text-xl font-bold tracking-tight text-[#1a1112]">{title}</h1>
    </div>
  );
}
