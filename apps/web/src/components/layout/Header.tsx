"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "../../../app/shell.module.css";

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard":     { title: "Dashboard",  subtitle: "Acme workspace" },
  "/links":         { title: "Links",       subtitle: "Acme workspace" },
  "/links/create":  { title: "Create Link", subtitle: "Acme workspace" },
  "/analytics":     { title: "Analytics",   subtitle: "Acme workspace" },
  "/billing":       { title: "Billing",     subtitle: "Acme workspace" },
  "/settings":      { title: "Settings",    subtitle: "Acme workspace" },
};

function useRouteTitle() {
  const pathname = usePathname();
  // dynamic segments: /links/[id]
  if (pathname.startsWith("/links/") && pathname !== "/links/create") {
    return { title: "Link Detail", subtitle: "Acme workspace" };
  }
  return ROUTE_META[pathname] ?? { title: "LinkFork", subtitle: "Acme workspace" };
}

export const Header = () => {
  const { title, subtitle } = useRouteTitle();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerLeft}>
        <h2 className={styles.headerTitle}>{title}</h2>
        <span className={styles.headerSubtitle}>{subtitle}</span>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search links..."
          />
        </div>
        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            /* Sun — shown in light mode, click to go dark */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            /* Crescent moon — shown in dark mode, click to go light */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <button
          className={styles.iconButton}
          title="Notifications"
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>
        <button
          className={styles.iconButton}
          title="Help"
          aria-label="Help"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 0c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
        <div className={styles.headerAvatar}>
          AM
        </div>
      </div>
    </header>
  );
};
