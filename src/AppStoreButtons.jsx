// AppStoreButtons.jsx — Girard App Store / Google Play badges (drop-in React)
//
// USAGE:
//   import AppStoreButtons from "./AppStoreButtons";
//   <AppStoreButtons />                      // "launching soon" (default)
//   <AppStoreButtons live />                 // full-colour, clickable
//
// TO GO LIVE: add the  live  prop where you use it (see App Review note).
// Links are already correct and reserved for your apps.

import React from "react";

const IOS_URL = "https://apps.apple.com/app/id6795445952";
const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.girardpropertylimited.twa";

export default function AppStoreButtons({ live = false, align = "center" }) {
  const wrap = {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center",
    justifyContent: align,
  };

  const badge = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    background: "#16324F",          // Ink Navy
    color: "#fff",
    borderRadius: 12,
    padding: "12px 18px",
    minWidth: 190,
    opacity: live ? 1 : 0.55,
    pointerEvents: live ? "auto" : "none",
    transition: "filter .15s ease",
    fontFamily: "Calibri, Arial, sans-serif",
  };

  const label = { display: "flex", flexDirection: "column", lineHeight: 1.1 };
  const small = { fontSize: 10, opacity: 0.85 };
  const strong = { fontSize: 17, fontWeight: 700 };

  const onEnter = (e) => live && (e.currentTarget.style.filter = "brightness(1.18)");
  const onLeave = (e) => (e.currentTarget.style.filter = "none");

  return (
    <div style={wrap}>
      {/* Apple App Store */}
      <a
        href={IOS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Girard on the App Store"
        style={badge}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.75.85-1.98 1.5-3.16 1.41-.14-1.12.44-2.28 1.1-3.03.75-.85 2.05-1.47 3.18-1.36zM20.5 17.2c-.6 1.37-.9 1.98-1.67 3.2-1.08 1.7-2.6 3.82-4.48 3.83-1.67.02-2.1-1.08-4.37-1.07-2.27.01-2.74 1.09-4.41 1.08-1.88-.02-3.32-1.93-4.4-3.63C-.4 17.6-.7 12.3 1.4 9.5c1.13-1.5 2.9-2.44 4.57-2.44 1.7 0 2.77 1.09 4.18 1.09 1.36 0 2.19-1.09 4.16-1.09 1.48 0 3.05.81 4.17 2.2-3.67 2.01-3.07 7.25.72 8.94z" />
        </svg>
        <span style={label}>
          <small style={small}>Download on the</small>
          <strong style={strong}>App Store</strong>
        </span>
      </a>

      {/* Google Play */}
      <a
        href={PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Girard on Google Play"
        style={badge}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <svg width="24" height="24" viewBox="0 0 512 512" aria-hidden="true">
          <path fill="#00D2FF" d="M47 24l260 232L47 488c-9-5-15-15-15-27V51c0-12 6-22 15-27z" />
          <path fill="#FFC300" d="M361 210l-54 46-54-48 54-48 54 50z" />
          <path fill="#00E676" d="M47 24c4-2 9-3 14-2l246 138-54 48L47 24z" />
          <path fill="#FF3D00" d="M47 488c-1 1 206-208 206-208l54 48L61 490c-5 1-10 0-14-2z" />
        </svg>
        <span style={label}>
          <small style={small}>GET IT ON</small>
          <strong style={strong}>Google Play</strong>
        </span>
      </a>

      {/* Launching-soon pill (hidden once live) */}
      {!live && (
        <span
          style={{
            fontFamily: "Calibri, Arial, sans-serif",
            fontSize: 12,
            letterSpacing: 0.5,
            color: "#7A5C00",           // Dark Gold
            background: "#F2EDE3",       // Warm Gray
            border: "1px solid #C9A24B", // Estate Gold
            borderRadius: 20,
            padding: "6px 14px",
          }}
        >
          LAUNCHING SOON
        </span>
      )}
    </div>
  );
}
