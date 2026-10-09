import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({ 
  children, 
  className = "", 
  variant = "default",
  padding = "md" 
}: CardProps) => {
  const variantClass = variant === "elevated" ? styles.cardElevated : 
                      variant === "outlined" ? styles.cardOutlined : 
                      styles.cardDefault;
  
  const paddingClass = padding === "none" ? styles.paddingNone :
                      padding === "sm" ? styles.paddingSm :
                      padding === "lg" ? styles.paddingLg :
                      styles.paddingMd;
  
  return (
    <div className={`${styles.card} ${variantClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = "" }: CardContentProps) => {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = "" }: CardFooterProps) => {
  return (
    <div className={`${styles.cardFooter} ${className}`}>
      {children}
    </div>
  );
};
