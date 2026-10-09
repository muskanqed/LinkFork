import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) => {
  const variantClass = variant === "secondary" ? styles.buttonSecondary :
                      variant === "outline" ? styles.buttonOutline :
                      variant === "ghost" ? styles.buttonGhost :
                      variant === "danger" ? styles.buttonDanger :
                      styles.buttonPrimary;
  
  const sizeClass = size === "sm" ? styles.buttonSm :
                   size === "lg" ? styles.buttonLg :
                   styles.buttonMd;
  
  const widthClass = fullWidth ? styles.buttonFull : "";
  const loadingClass = isLoading ? styles.buttonLoading : "";
  const disabledClass = disabled ? styles.buttonDisabled : "";
  
  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className={styles.loadingSpinner}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};
