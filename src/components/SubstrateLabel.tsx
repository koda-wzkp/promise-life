"use client";

import { SubstrateParams } from "@/lib/types";
import { getSubstrateLabel } from "@/lib/substrates";

interface SubstrateLabelProps {
  substrate: SubstrateParams;
  compact?: boolean;
}

export default function SubstrateLabel({
  substrate,
  compact = false,
}: SubstrateLabelProps) {
  const label = getSubstrateLabel(substrate);

  if (compact) {
    return (
      <div className="text-center mt-1.5">
        <p
          className="text-xs font-medium font-sans"
          style={{ color: substrate.color.label }}
        >
          {substrate.shortName}
        </p>
        <p className="text-[10px] text-muted truncate max-w-[200px] mx-auto">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h3
        className="text-sm font-semibold font-sans"
        style={{ color: substrate.color.label }}
      >
        {substrate.name}
      </h3>
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  );
}
