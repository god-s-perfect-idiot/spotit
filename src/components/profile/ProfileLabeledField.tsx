import type { ReactNode } from "react";

type ProfileLabeledFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function ProfileLabeledField({ label, children, className = "" }: ProfileLabeledFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-[#4a3d3f]/72">{label}</span>
      {children}
    </label>
  );
}

export function ProfileInputShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[48px] items-center rounded-2xl border border-[#FF8D7B] bg-white px-3 py-2 text-[15px] font-medium text-[#1a1112] ${className}`}
    >
      {children}
    </div>
  );
}
