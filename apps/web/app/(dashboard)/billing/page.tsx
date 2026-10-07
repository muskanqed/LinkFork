import React from "react";
import styles from "./billing.module.css";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["50 short links", "Basic analytics", "Standard support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    features: [
      "Unlimited short links",
      "Advanced analytics",
      "Custom domains",
      "Priority support",
      "Team seats (up to 5)",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "SLA guarantee",
      "Unlimited team seats",
    ],
    current: false,
  },
];

const INVOICES = [
  { date: "Oct 1, 2026", amount: "$12.00", status: "Paid", id: "INV-0012" },
  { date: "Sep 1, 2026", amount: "$12.00", status: "Paid", id: "INV-0011" },
  { date: "Aug 1, 2026", amount: "$12.00", status: "Paid", id: "INV-0010" },
];

export default function BillingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Billing</h1>
        <p className={styles.subtitle}>Manage your subscription and payment history.</p>
      </header>

      {/* Current plan banner */}
      <div className={styles.currentBanner}>
        <div className={styles.bannerLeft}>
          <span className={styles.planBadge}>Pro plan</span>
          <div>
            <p className={styles.bannerTitle}>You&apos;re on the Pro plan</p>
            <p className={styles.bannerSub}>Your next billing date is November 1, 2026.</p>
          </div>
        </div>
        <button className={styles.manageBillingBtn}>Manage billing</button>
      </div>

      {/* Plan cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Plans</h2>
        <div className={styles.plansGrid}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`${styles.planCard} ${plan.current ? styles.currentPlan : ""}`}>
              {plan.current && <span className={styles.currentLabel}>Current plan</span>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.planPriceRow}>
                <span className={styles.planPrice}>{plan.price}</span>
                <span className={styles.planPeriod}>&nbsp;/ {plan.period}</span>
              </div>
              <ul className={styles.featureList}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button className={plan.name === "Enterprise" ? styles.contactBtn : styles.upgradeBtn}>
                  {plan.name === "Enterprise" ? "Contact sales" : "Upgrade"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Invoice history */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Invoice history</h2>
        <div className={styles.invoiceCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Invoice</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className={styles.tr}>
                  <td className={styles.td}><span className={styles.invoiceId}>{inv.id}</span></td>
                  <td className={styles.td}><span className={styles.muted}>{inv.date}</span></td>
                  <td className={styles.td}><span className={styles.amount}>{inv.amount}</span></td>
                  <td className={styles.td}>
                    <span className={styles.paidBadge}>{inv.status}</span>
                  </td>
                  <td className={styles.td}>
                    <button className={styles.downloadBtn}>Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
