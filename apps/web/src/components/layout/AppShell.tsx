"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import styles from "../../../app/shell.module.css";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.appShell}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.appShellMain}>
        <Header />
        <main className={styles.appMain}>
          {children}
        </main>
      </div>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>
      {isOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};