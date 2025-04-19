"use client";

import { getStatusColorClass } from "../../utils/themeUtils";

const StateCard = ({ status, count }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColorClass(status)}`}
          />
          <span className="text-sm font-medium text-foreground">{status}</span>
        </div>
        <span className="text-2xl font-semibold text-foreground">{count}</span>
      </div>
    </div>
  );
};

export default StateCard;
