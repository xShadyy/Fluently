"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProficiencyQuiz from "@/components/ui/ProficiencyQuiz/ProficiencyQuiz";
import LanguageDashboard from "@/components/ui/Dashboard/LanguageDashboard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const hasCompletedQuiz =
          localStorage.getItem("quizCompleted") === "true";

        const response = await fetch("/api/quiz/status", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const apiQuizCompleted = data.hasCompleted;

          setQuizCompleted(apiQuizCompleted);
          setShowQuiz(!apiQuizCompleted);

          if (apiQuizCompleted) {
            localStorage.setItem("quizCompleted", "true");
          } else {
            localStorage.removeItem("quizCompleted");
          }
        } else {
          setQuizCompleted(hasCompletedQuiz);
          setShowQuiz(!hasCompletedQuiz);
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);

        const hasCompletedQuiz =
          localStorage.getItem("quizCompleted") === "true";
        setQuizCompleted(hasCompletedQuiz);
        setShowQuiz(!hasCompletedQuiz);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuizStatus();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
      setQuizCompleted(hasCompletedQuiz);
      setShowQuiz(!hasCompletedQuiz);
    };

    const handleQuizCompleted = () => {
      setQuizCompleted(true);
      setShowQuiz(false);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("quizCompleted", handleQuizCompleted);

    window.addEventListener("focus", () => {
      const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
      setQuizCompleted(hasCompletedQuiz);
      setShowQuiz(!hasCompletedQuiz);
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quizCompleted", handleQuizCompleted);
      window.removeEventListener("focus", () => {});
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {showQuiz ? (
        <ProficiencyQuiz />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
