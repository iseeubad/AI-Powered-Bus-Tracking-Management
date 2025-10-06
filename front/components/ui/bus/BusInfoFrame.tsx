"use client"

import BusInfo from "./BusInfo"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function BusInfoFrame() {
  const [showAll, setShowAll] = useState(false)

  const buses = [
    { number: ["07", "#00FFDD"], destination: "SOUANI", ETA: "5min" },
    { number: ["01", "#FF00EE"], destination: "BOJARAH", ETA: "16min" },
    { number: ["16", "#007ff7"], destination: "BOJARAH", ETA: "now" },
    { number: ["36", "#84f700"], destination: "BOJARAH", ETA: "1h:12min" },
    { number: ["24", "#f70084"], destination: "TEST", ETA: "10min" },
    { number: ["12", "#ffaa00"], destination: "TEST2", ETA: "20min" },
    { number: ["35", "#ffaaf0"], destination: "TEST2", ETA: "20min" },
    { number: ["24", "#f30a30"], destination: "TEST2", ETA: "20min" },
  ]

  const displayedBuses = showAll ? buses : buses.slice(0, 5)
  const hasMoreBuses = buses.length > 5

  return (
    <div className="flex flex-col gap-1 w-fit" style={{ pointerEvents: "none" }}>
      <div className="flex flex-col gap-1 max-h-[calc(100dvh-120px)] w-fit overflow-y-auto" style={{ pointerEvents: "auto" }}>
        {displayedBuses.map((bus, index) => (
          <BusInfo key={index} number={bus.number as [string, string]} destination={bus.destination} ETA={bus.ETA} />
        ))}

        {hasMoreBuses && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-fit flex items-center justify-center gap-2 p-1 bg-black/20 backdrop-blur-md border border-[#ffffff4d] rounded-xl text-white font-semibold hover:bg-black/30 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-fit h-fit" />
              </>
            ) : (
              <>
                <ChevronDown className="w-fit h-fit" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
