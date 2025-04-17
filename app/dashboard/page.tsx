"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ProficiencyQuiz from "@/components/ui/ProficiencyQuiz/ProficiencyQuiz";
import LanguageDashboard from "@/components/ui/Dashboard/LanguageDashboard";

export default function Dashboard() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        // First check localStorage for immediate UI response
        const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
        
        // Then check the API for the actual status
        const response = await fetch('/api/quiz/status', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          const apiQuizCompleted = data.hasCompleted;
          
          // Update state based on API response
          setQuizCompleted(apiQuizCompleted);
          setShowQuiz(!apiQuizCompleted);
          
          // Update localStorage to match API
          if (apiQuizCompleted) {
            localStorage.setItem("quizCompleted", "true");
          }
        } else {
          // Fallback to localStorage if API fails
          setQuizCompleted(hasCompletedQuiz);
          setShowQuiz(!hasCompletedQuiz);
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
        // Fallback to localStorage if API fails
        const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
        setQuizCompleted(hasCompletedQuiz);
        setShowQuiz(!hasCompletedQuiz);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkQuizStatus();
  }, []);

  const handleQuizComplete = (score: number, level: string) => {
    // Store quiz completion in localStorage
    localStorage.setItem("quizCompleted", "true");
    setQuizCompleted(true);
    setShowQuiz(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {showQuiz ? (
        <ProficiencyQuiz onComplete={handleQuizComplete} />
      ) : (
        <LanguageDashboard />
      )}
    </AnimatePresence>
  );
}
