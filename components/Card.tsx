"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  stripColor?: string;
}

function onCardMove(e: React.MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Card({ children, className, stripColor }: CardProps) {
  return (
    <div
      onMouseMove={onCardMove}
      className={cn(
        "card-spotlight relative overflow-hidden rounded-2xl border border-border bg-surface p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      {stripColor && (
        <span className={cn("absolute left-0 top-0 z-[2] h-full w-1", stripColor)} />
      )}
      <div className="relative z-[2]">{children}</div>
      <style jsx>{`
        .card-spotlight::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.35s;
          background: radial-gradient(
            340px circle at var(--mx, 50%) var(--my, 50%),
            rgba(139, 92, 246, 0.16),
            transparent 60%
          );
          pointer-events: none;
          z-index: 0;
        }
        .card-spotlight::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          opacity: 0;
          transition: opacity 0.35s;
          background: radial-gradient(
            300px circle at var(--mx, 50%) var(--my, 50%),
            rgba(46, 230, 200, 0.55),
            rgba(139, 92, 246, 0.35) 40%,
            transparent 65%
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .card-spotlight:hover::before,
        .card-spotlight:hover::after {
          opacity: 1;
        }
        .card-spotlight:hover {
          box-shadow: 0 26px 60px -24px rgba(124, 58, 237, 0.6);
        }
      `}</style>
    </div>
  );
}
