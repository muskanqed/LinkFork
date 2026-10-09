import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import styles from "./billing.module.css";

// ── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for personal projects and experimentation.",
    price: "$0",
    period: "month",
    features: [
      "Up to 100 links",
      "5,000 clicks per month",
      "Basic analytics dashboard",
      "Standard short URLs",
      "7-day link history",
    ],
    cta: "Current Plan",
    ctaVariant: "current" as const,
    popular: false,
    current: true,
    icon: "🆓",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For creators, influencers, and growing teams.",
    price: "$12",
    period: "month",
    features: [
      "Unlimited links",
      "100,000 clicks per month",
      "Advanced analytics with geolocation",
      "Custom aliases & branded links",
      "UTM parameter tracking",
      "Priority email support",
      "Team member access (3 users)",
      "QR code generation",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "primary" as const,
    popular: true,
    current: false,
    icon: "⚡",
  },
  {
    id: "business",
    name: "Business",
    description: "For high‑volume organizations and enterprises.",
    price: "$39",
    period: "month",
    features: [
      "Unlimited links & clicks",
      "Advanced analytics suite",
      "Custom domain support",
      "Team workspace (10+ users)",
      "API access & webhooks",
      "Advanced security controls",
      "Custom branding",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Choose Business",
    ctaVariant: "secondary" as const,
    popular: false,
    current: false,
    icon: "🏢",
  },
] as const;

const USAGE = [
  {
    label: "Links used",
    used: 42,
    total: 100,
    warning: null,
    color: "primary" as const,
    icon: "🔗",
  },
  {
    label: "Monthly clicks",
    used: 4821,
    total: 5000,
    warning: "Approaching your monthly limit",
    color: "warning" as const,
    icon: "📈",
  },
  {
    label: "API requests",
    used: 1284,
    total: 10000,
    warning: null,
    color: "primary" as const,
    icon: "⚙️",
  },
];

const BILLING_HISTORY = [
  {
    id: 1,
    date: "Oct 14, 2026",
    description: "Pro Plan Subscription",
    amount: "$12.00",
    status: "Paid",
    invoice: "#INV-2026-001",
  },
  {
    id: 2,
    date: "Sep 14, 2026",
    description: "Pro Plan Subscription",
    amount: "$12.00",
    status: "Paid",
    invoice: "#INV-2025-012",
  },
  {
    id: 3,
    date: "Aug 14, 2026",
    description: "Pro Plan Subscription",
    amount: "$12.00",
    status: "Paid",
    invoice: "#INV-2025-011",
  },
  {
    id: 4,
    date: "Jul 14, 2026",
    description: "Free to Pro Upgrade",
    amount: "$12.00",
    status: "Paid",
    invoice: "#INV-2025-010",
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ── Helper Components ─────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" }) {
  const variantClass = variant === "success" ? styles.badgeSuccess : 
                      variant === "warning" ? styles.badgeWarning : 
                      variant === "error" ? styles.badgeError : 
                      styles.badgeDefault;
  
  return (
    <span className={`${styles.badge} ${variantClass}`}>
      {children}
    </span>
  );
}

// ── Helper Functions ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString();
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* ── Page header ── */}
        <Card variant="outlined" className={styles.pageHeaderCard}>
          <CardContent>
            <div className={styles.pageHeaderContent}>
              <div>
                <h1 className={styles.pageTitle}>Plans & Billing</h1>
                <p className={styles.pageSubtitle}>
                  Choose the perfect plan for your link management needs. Upgrade, downgrade, or cancel anytime.
                </p>
              </div>
              <div className={styles.billingCycle}>
                <span className={styles.billingCycleLabel}>Billing cycle:</span>
                <span className={styles.billingCycleValue}>Monthly • Next invoice: Nov 14, 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Pricing cards ── */}
        <div className={styles.plansGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.popular ? styles.planCardFeatured : ""} ${plan.current ? styles.planCardCurrent : ""}`}
            >
              {/* Plan icon and header */}
              <div className={styles.planHeader}>
                <div className={styles.planIcon}>{plan.icon}</div>
                <div>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <p className={styles.planDesc}>{plan.description}</p>
                </div>
              </div>

              {/* Most Popular badge */}
              {plan.popular && (
                <div className={styles.featuredBadge}>
                  <SparkIcon />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Current Plan badge */}
              {plan.current && (
                <div className={styles.currentBadge}>
                  <span>Your Current Plan</span>
                </div>
              )}

              {/* Price */}
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>{plan.price}</span>
                <span className={styles.pricePeriod}>/ {plan.period}</span>
              </div>

              {/* Features */}
              <div className={styles.featuresContainer}>
                <ul className={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.checkIcon}>
                        <CheckIcon />
                      </span>
                      <span className={styles.featureText}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className={styles.planActions}>
                {plan.ctaVariant === "current" ? (
                  <Button variant="outline" fullWidth disabled>
                    {plan.cta}
                  </Button>
                ) : plan.ctaVariant === "primary" ? (
                  <Button variant="primary" fullWidth>
                    {plan.cta}
                  </Button>
                ) : (
                  <Button variant="secondary" fullWidth>
                    {plan.cta}
                  </Button>
                )}
                {plan.current && (
                  <Button variant="ghost" fullWidth>
                    Manage Plan
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column layout: Usage + Payment ── */}
        <div className={styles.twoColumnGrid}>
          {/* Current usage */}
          <Card variant="elevated">
            <CardHeader>
              <div>
                <h2 className={styles.cardTitle}>Current Usage</h2>
                <p className={styles.cardSubtitle}>Usage resets on November 1, 2026</p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className={styles.usageGrid}>
                {USAGE.map((item) => {
                  const percentage = Math.min(100, Math.round((item.used / item.total) * 100));
                  return (
                    <div key={item.label} className={styles.usageItem}>
                      <div className={styles.usageHeader}>
                        <div className={styles.usageIcon}>{item.icon}</div>
                        <div className={styles.usageInfo}>
                          <span className={styles.usageLabel}>{item.label}</span>
                          <span className={`${styles.usageCount} ${item.color === "warning" ? styles.usageCountWarning : ""}`}>
                            {formatNumber(item.used)} / {formatNumber(item.total)}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.progressContainer}>
                        <div className={styles.progressTrack}>
                          <div
                            className={`${styles.progressFill} ${item.color === "warning" ? styles.progressFillWarning : ""}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className={styles.progressPercentage}>{percentage}%</span>
                      </div>
                      
                      {item.warning && (
                        <div className={styles.usageWarning}>
                          <span className={styles.warningIcon}>⚠️</span>
                          <span>{item.warning}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            
            <CardFooter>
              <p className={styles.usageNote}>
                Need more capacity? <button className={styles.inlineLink}>Upgrade your plan</button> to unlock higher limits.
              </p>
            </CardFooter>
          </Card>

          {/* Payment method */}
          <Card variant="elevated">
            <CardHeader>
              <div>
                <h2 className={styles.cardTitle}>Payment Method</h2>
                <p className={styles.cardSubtitle}>Manage your billing details</p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className={styles.paymentMethod}>
                <div className={styles.paymentCardInfo}>
                  <div className={styles.cardChip}>
                    <div className={styles.cardType}>VISA</div>
                    <div className={styles.cardChipIcon}>💳</div>
                  </div>
                  <div className={styles.cardDetails}>
                    <div className={styles.cardNumber}>•••• •••• •••• 4242</div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardHolder}>Alex Johnson</span>
                      <span className={styles.cardExpiry}>Expires 08/28</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.paymentActions}>
                  <Button variant="primary" size="sm">
                    Update
                  </Button>
                  <Button variant="outline" size="sm">
                    Add New
                  </Button>
                </div>
              </div>
              
              <div className={styles.billingInfo}>
                <div className={styles.billingItem}>
                  <span className={styles.billingLabel}>Billing email</span>
                  <span className={styles.billingValue}>alex.johnson@example.com</span>
                </div>
                <div className={styles.billingItem}>
                  <span className={styles.billingLabel}>Tax ID</span>
                  <span className={styles.billingValue}>US-123456789</span>
                </div>
                <div className={styles.billingItem}>
                  <span className={styles.billingLabel}>Next billing date</span>
                  <span className={styles.billingValue}>November 14, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Billing history ── */}
        <Card variant="elevated">
          <CardHeader>
            <div>
              <h2 className={styles.cardTitle}>Billing History</h2>
              <p className={styles.cardSubtitle}>Past invoices and payments</p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon />
              Download All
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className={styles.historyTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Date</div>
                <div className={styles.tableCell}>Description</div>
                <div className={styles.tableCell}>Amount</div>
                <div className={styles.tableCell}>Status</div>
                <div className={styles.tableCell}>Invoice</div>
                <div className={styles.tableCell}>Actions</div>
              </div>
              
              {BILLING_HISTORY.map((item) => (
                <div key={item.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    <span className={styles.cellValue}>{item.date}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.cellValue}>{item.description}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.cellValueBold}>{item.amount}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.cellValueMuted}>{item.invoice}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <Button variant="ghost" size="sm">
                      <DownloadIcon />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter>
            <p className={styles.historyNote}>
              Need a custom invoice or have billing questions? <button className={styles.inlineLink}>Contact support</button>
            </p>
          </CardFooter>
        </Card>

        {/* ── FAQ section ── */}
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I change plans anytime?</h3>
              <p className={styles.faqAnswer}>Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
              <p className={styles.faqAnswer}>We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Do you offer refunds?</h3>
              <p className={styles.faqAnswer}>We offer a 30-day money-back guarantee for all annual plans. Monthly plans can be canceled anytime with no further charges.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is there a free trial for paid plans?</h3>
              <p className={styles.faqAnswer}>All paid plans include a 14-day free trial with full access to all features. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
