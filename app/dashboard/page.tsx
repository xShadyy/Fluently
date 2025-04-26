"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProficiencyQuiz from "@/components/ui/ProficiencyQuiz/ProficiencyQuiz";
import LanguageDashboard from "@/components/ui/Dashboard/LanguageDashboard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const initialized = useRef(false);
  const alreadyCheckedDb = useRef(false);

  const checkQuizStatus = useCallback(async () => {
    if (status !== "authenticated" || alreadyCheckedDb.current) return;

    alreadyCheckedDb.current = true;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/quiz/status?t=${Date.now()}`, {
        headers: { "cache-control": "no-cache", pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setQuizCompleted(data.hasCompleted);
        setShowQuiz(!data.hasCompleted);
      } else {
        setQuizCompleted(false);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
      setQuizCompleted(false);
      setShowQuiz(true);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (!initialized.current && status === "authenticated") {
      initialized.current = true;
      checkQuizStatus();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, checkQuizStatus, router]);

  const handleQuizCompleted = useCallback(() => {
    setQuizCompleted(true);
    setShowQuiz(false);
  }, []);

  if (isLoading || status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showQuiz ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ProficiencyQuiz onQuizCompleted={handleQuizCompleted} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LanguageDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
