"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay } from "@mantine/core";
import Translator from "../../components/ui/Translator/Translator";
import styles from "./page.module.css";

export default function TranslatorPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
      }
    };
    fetchUser();
  }, []);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </div>
    );
  }

  return <Translator />;
}
