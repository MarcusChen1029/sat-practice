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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full text-left rounded-lg border px-4 py-3 transition",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        state === "idle" && "border-neutral-300 dark:border-neutral-700",
        state === "selected" && "border-blue-500 bg-blue-50 dark:bg-blue-950",
        state === "correct" && "border-green-600 bg-green-50 dark:bg-green-950",
        state === "wrong" && "border-red-600 bg-red-50 dark:bg-red-950",
        state === "revealed-correct" && "border-green-600 bg-green-50 dark:bg-green-950",
        disabled && "cursor-not-allowed opacity-80"
      )}
    >
      <span className="mr-3 inline-block w-6 font-semibold">{letter}.</span>
      <span>{text}</span>
    </button>
  );
}
