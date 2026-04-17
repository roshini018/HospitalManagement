import React from "react";
import { Star } from "lucide-react";

/**
 * Stars Component
 * Renders a row of 5 stars with a given rating.
 * 
 * @param {number} rating - The rating value (0-5).
 */
const Stars = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"
          }`}
        />
      ))}
    </div>
  );
};

export default Stars;
