"use client";

export default function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted font-mono flex-wrap">
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#F59E0B" }}
          aria-hidden="true"
        />
        <span>Full vitality</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#92400E" }}
          aria-hidden="true"
        />
        <span>Fading</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#6B7280" }}
          aria-hidden="true"
        />
        <span>Non-cooperative</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: "#1C1917" }}
          aria-hidden="true"
        />
        <span>Dead</span>
      </div>
    </div>
  );
}
