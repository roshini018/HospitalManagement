import { Star } from "lucide-react";

export default function FeedbackStars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star}`}
          className="group rounded-lg p-1 transition-transform duration-150 hover:scale-125 active:scale-95"
        >
          <Star
            className={`h-7 w-7 transition-all duration-150 ${
              star <= value
                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                : "text-slate-200 group-hover:text-amber-200"
            }`}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}