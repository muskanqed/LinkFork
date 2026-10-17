"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import styles from "../../../app/shell.module.css";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

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