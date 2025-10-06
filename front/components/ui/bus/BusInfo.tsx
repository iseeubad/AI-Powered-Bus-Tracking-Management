"use client";

import type { BusInfoProp } from "@/lib/BusInfoProps";
import { useState } from "react";

export default function BusInfo({
  number,
  destination,
  ETA,
  containerClassName = "",
  badgeClassName = "",
  showBadge = true,
  showETA = true,
}: BusInfoProp) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 bg-black/10 backdrop-blur-md border border-[#ffffff4d] rounded-xl ease-in-out transition-none duration-150 cursor-pointer
    ${isExpanded ? "w-full p-2" : "w-fit p-1"} ${containerClassName}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {showBadge && (
        <div
          className={`p-0.5 flex items-center justify-center text-black font-bold text-lg rounded-lg transition-none ${badgeClassName} ${
            isExpanded ? "scale-110" : ""
          }`}
          style={{ backgroundColor: number[1] }}
        >
          {number[0]}
        </div>
      )}

      {isExpanded && (
        <>
          <div className="flex flex-col flex-1">
            <span className="text-sm text-gray-400">Bus Line {number[0]}</span>
            <span className="font-semibold text-white">{destination}</span>
          </div>
          {showETA && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">Arrives in</span>
              <span className="text-xl font-bold" style={{ color: number[1] }}>
                {ETA}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
