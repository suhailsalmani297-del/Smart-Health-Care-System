import React from 'react'
import { T, SPEC } from './Constants'

export function Avatar({ name, size = 52, spec, img }) {
  const s = SPEC[spec] || { bg: T.blueLt, fg: T.blue };
  if (img) {
    return (
      <img src={img} alt={name} style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${s.fg}40`, objectFit: "cover", flexShrink: 0
      }} />
    );
  }
  const words = name.replace("Dr. ", "").split(" ");
  const initials = words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: s.bg, border: `2px solid ${s.fg}22`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: s.fg, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
    }}>{initials}</div>
  );
}

export function Stars({ rating, size = 13 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= full ? "#F59E0B" : i === full + 1 && half ? "#F59E0B" : "#D1D5DB", opacity: i === full + 1 && half ? 0.6 : 1 }}>
          ★
        </span>
      ))}
    </span>
  );
}

export function SpecBadge({ spec, size = "sm" }) {
  const s = SPEC[spec] || { bg: T.blueLt, fg: T.blue, icon: "🩺" };
  const pad = size === "sm" ? "3px 9px" : "5px 13px";
  const fs = size === "sm" ? 11 : 12.5;
  return (
    <span style={{ background: s.bg, color: s.fg, borderRadius: 99, padding: pad, fontSize: fs, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, lineHeight: 1.4 }}>
      <span style={{ fontSize: fs - 1 }}>{s.icon}</span>{spec}
    </span>
  );
}

export function Btn({ children, variant = "primary", size = "md", onClick, disabled, full, style: sx, type = "button" }) {
  const v = {
    primary: { bg: T.blue,     fg: "#fff",   border: "none",                  sh: `0 4px 14px ${T.blue}40` },
    ghost:   { bg: "transparent",fg: T.blue, border: `1.5px solid ${T.bluePale}`, sh: "none" },
    green:   { bg: T.greenMid, fg: "#fff",   border: "none",                  sh: `0 4px 14px ${T.green}40` },
    danger:  { bg: T.red,      fg: "#fff",   border: "none",                  sh: `0 4px 14px ${T.red}40` },
    outline: { bg: T.surface,  fg: T.textMd, border: `1.5px solid ${T.border}`, sh: T.sh1 },
  }[variant] || {};
  const pad = { sm: "7px 14px", md: "10px 20px", lg: "13px 28px" }[size];
  const fs  = { sm: 12.5, md: 13.5, lg: 15 }[size];
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: pad, borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#E5E7EB" : v.bg, color: disabled ? "#9CA3AF" : v.fg,
      border: v.border || "none", fontWeight: 600, fontSize: fs,
      transition: "all .2s", boxShadow: disabled ? "none" : v.sh,
      display: "inline-flex", alignItems: "center", gap: 6,
      width: full ? "100%" : "auto", justifyContent: full ? "center" : "flex-start",
      opacity: disabled ? 0.75 : 1, fontFamily: "inherit", ...sx,
    }}>{children}</button>
  );
}

export function Chip({ label, active, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
      background: active ? T.blue : T.surface, color: active ? "#fff" : T.muted,
      fontSize: 12, fontWeight: active ? 600 : 500,
      transition: "all .18s", boxShadow: active ? `0 2px 8px ${T.blue}40` : T.sh1,
      display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "inherit",
    }}>
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}{label}
    </button>
  );
}

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const fmtDate = (d) =>
  d instanceof Date
    ? d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : d;

export const fmtDateShort = (d) =>
  d instanceof Date
    ? d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : d;
