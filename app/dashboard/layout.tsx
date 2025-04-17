"use client";

import { useState, useEffect } from "react";
import SideMenu from "../components/ui/SideMenu/SideMenu";
import UserHeader from "../components/ui/UserHeader/UserHeader";
import styles from "./page.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <SideMenu disableAnimation={!shouldAnimate} />
      <div className={styles.main}>
        <UserHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
