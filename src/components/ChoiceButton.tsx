"use client";
import clsx from "clsx";

type State = "idle" | "selected" | "correct" | "wrong" | "revealed-correct";

export function ChoiceButton({
  letter, text, state, onClick, disabled,
}: {
  letter: string;
  text: string;
  state: State;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const showCheck = state === "correct" || state === "revealed-correct";
  const showCross = state === "wrong";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood",
        state === "idle" && "border-rule bg-white hover:border-oxblood hover:bg-[#f6f8fe]",
        state === "selected" && "border-2 border-oxblood bg-[#f1f5fe]",
        state === "correct" && "border-2 border-olive bg-[#eef7f1]",
        state === "wrong" && "border-2 border-terracotta bg-[#fdf0ef]",
        state === "revealed-correct" && "border-2 border-olive bg-[#eef7f1]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={clsx(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-bold transition",
          state === "idle" && "border-ink-3 bg-white text-ink-2 group-hover:border-oxblood group-hover:text-oxblood",
          state === "selected" && "border-oxblood bg-oxblood text-white",
          (state === "correct" || state === "revealed-correct") && "border-olive bg-olive text-white",
          state === "wrong" && "border-terracotta bg-terracotta text-white",
        )}
      >
        {showCheck ? "✓" : showCross ? "✕" : letter}
      </span>
      <span className="flex-1 text-[15.5px] leading-[1.5] text-ink">{text}</span>
    </button>
  );
}
