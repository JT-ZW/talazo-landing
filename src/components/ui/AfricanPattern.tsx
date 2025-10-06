"use client";

import React from "react";

interface AfricanPatternProps {
  variant?: "kente" | "mudcloth" | "geometric" | "tribal";
  opacity?: number;
  className?: string;
}

export default function AfricanPattern({
  variant = "geometric",
  opacity = 0.1,
  className = "",
}: AfricanPatternProps) {
  const patterns = {
    kente: (
      <pattern
        id="kente-pattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <rect width="40" height="40" fill="transparent" />
        <path
          d="M0 20 L20 0 L40 20 L20 40 Z"
          fill="currentColor"
          opacity={opacity}
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity={opacity} />
      </pattern>
    ),
    mudcloth: (
      <pattern
        id="mudcloth-pattern"
        x="0"
        y="0"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse"
      >
        <rect width="60" height="60" fill="transparent" />
        <path
          d="M0 30 Q15 20 30 30 Q45 40 60 30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity={opacity}
        />
        <path
          d="M10 10 L20 10 M40 10 L50 10 M10 50 L20 50 M40 50 L50 50"
          stroke="currentColor"
          strokeWidth="2"
          opacity={opacity}
        />
      </pattern>
    ),
    geometric: (
      <pattern
        id="geometric-pattern"
        x="0"
        y="0"
        width="50"
        height="50"
        patternUnits="userSpaceOnUse"
      >
        <rect width="50" height="50" fill="transparent" />
        <path
          d="M0 0 L25 25 L0 50 M50 0 L25 25 L50 50"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity={opacity}
        />
        <circle cx="25" cy="25" r="5" fill="currentColor" opacity={opacity} />
      </pattern>
    ),
    tribal: (
      <pattern
        id="tribal-pattern"
        x="0"
        y="0"
        width="80"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        <rect width="80" height="80" fill="transparent" />
        <path
          d="M20 40 L40 20 L60 40 L40 60 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity={opacity}
        />
        <path
          d="M0 0 L10 10 M70 0 L80 10 M0 70 L10 80 M70 70 L80 80"
          stroke="currentColor"
          strokeWidth="2"
          opacity={opacity}
        />
      </pattern>
    ),
  };

  const patternId = `${variant}-pattern`;

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>{patterns[variant]}</defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
