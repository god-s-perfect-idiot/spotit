import { Jelly } from "ldrs/react";
import "ldrs/react/Jelly.css";

type LoaderProps = {
  /** Shown next to / below the drop. */
  label?: string;
  /** Wrap content in a light card (full-page / panel loading). */
  withCard?: boolean;
  /** `compact` fits primary auth buttons; `default` for route / page loaders. */
  size?: "default" | "compact";
  className?: string;
  labelClassName?: string;
};

const BLOOD_COLOR = "#c81e2e";

export function Loader({
  label = "Loading",
  withCard = true,
  size = "default",
  className = "",
  labelClassName = "",
}: LoaderProps) {
  const compact = size === "compact";
  const inner = (
    <>
      <span className="inline-flex shrink-0 items-center justify-center" aria-hidden>
        <Jelly
          size={compact ? 32 : 48}
          color={BLOOD_COLOR}
          speed={compact ? 0.95 : 1.05}
        />
      </span>
      <span
        className={[
          compact ? "text-sm font-semibold" : "text-base font-bold",
          compact ? "" : "text-gray-700",
          labelClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </span>
    </>
  );

  if (withCard) {
    return (
      <div
        className={[
          "flex flex-col items-center justify-center gap-3 px-8 py-6",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center",
        compact ? "flex-row gap-2" : "flex-col gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {inner}
    </div>
  );
}
