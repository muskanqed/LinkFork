"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { apiRequest } = await import("@/lib/api");
      await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`grid-bg ${styles.container}`}>
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className={styles.brandText}>LinkFork</span>
          </div>

          <div className={styles.hero}>
            <h1 className={styles.headline}>
              Every click tells a story.<br />
              Make yours count.
            </h1>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div className={styles.featureText}>
                  <span className={styles.featureTitle}>Shorten links instantly</span>
                  <span className={styles.featureDesc}>Create clean, memorable links in seconds.</span>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
                <div className={styles.featureText}>
                  <span className={styles.featureTitle}>Track every click</span>
                  <span className={styles.featureDesc}>See engagement as it happens.</span>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <div className={styles.featureText}>
                  <span className={styles.featureTitle}>Understand your audience</span>
                  <span className={styles.featureDesc}>Turn traffic into clear decisions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Create your LinkFork account</h1>
              <p className={styles.subtitle}>Shorten links, track performance, and understand your audience.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div style={{ color: "red", fontSize: "0.875rem", textAlign: "center", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  type="text"
                  name="fullName"
                  className={styles.input}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={styles.input}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                />
                <span className={styles.checkboxLabel}>
                  I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className={styles.loginNav}>
              Already have an account? <Link href="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
