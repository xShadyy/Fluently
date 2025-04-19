"use client";
import { useState, useEffect } from "react";
import { correct, wrong, completed, uiClick } from "@/utils/sound";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./ProficiencyQuiz.module.css";
import { Button, Loader, Card, Text, Title } from "@mantine/core";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
}

export default function ProficiencyQuiz() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.error("NextAuth session error - user is not authenticated");
      setAuthError("Authentication error. Please try refreshing the page.");
    }
  }, [status]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/proficiencyquiz");
        const data = await res.json();
        if (res.ok) {
          const formattedQuestions: QuizQuestion[] = data.questions.map(
            (q: any, index: number) => ({
              id: index + 1,
              question: q.text,
              options: q.options.map((opt: any) => ({
                id: opt.id.toString(),
                text: opt.text,
              })),
              correctAnswer:
                q.correctAnswer && q.correctAnswer.option
                  ? q.correctAnswer.option.id.toString()
                  : "",
            }),
          );
          setQuestions(formattedQuestions);
        } else {
          console.error("Error fetching questions:", data.error);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption || showFeedback) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = optionId === currentQuestion.correctAnswer;
    if (isAnswerCorrect) {
      correct.play();
      setScore((prevScore) => prevScore + 1);
    } else {
      wrong.play();
    }
    setIsCorrect(isAnswerCorrect);
    setSelectedOption(optionId);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        completeQuiz();
      }
    }, 2500);
  };

  const completeQuiz = async () => {
    setShowResults(true);
    completed.play();
    triggerConfetti();
  };

  const handleCloseResults = async () => {
    try {
      const response = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to update quiz completion status");
      } else {
        localStorage.setItem("quizCompleted", "true");

        if (session) {
          session.user.hasCompletedProficiencyQuiz = true;
        }
      }
    } catch (error) {
      console.error("Error updating quiz completion status:", error);
    }

    setShowResults(false);

    window.dispatchEvent(new Event("quizCompleted"));
  };

  const getLanguageLevel = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90) return "C1";
    if (percentage >= 75) return "B2";
    if (percentage >= 60) return "B1";
    if (percentage >= 40) return "A2";
    return "A1";
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const ResultsScreen = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const level = getLanguageLevel();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={styles.resultsContainer}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.resultContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "500px",
            padding: "2rem",
          }}
        >
          <div>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreValue}>{percentage}%</div>
            </div>

            <div className={styles.resultDetails}>
              <Text size="xl" style={{ fontWeight: 700 }} ta="center" mb="md">
                Your Language Proficiency Level
              </Text>
              <div className={styles.levelBadge}>{level}</div>
              <Text className={styles.levelDescription}>
                {level === "C1" &&
                  "Advanced proficiency with near-native fluency"}
                {level === "B2" && "Upper intermediate level with good fluency"}
                {level === "B1" && "Intermediate level with functional fluency"}
                {level === "A2" &&
                  "Elementary level with basic communication skills"}
                {level === "A1" &&
                  "Beginner level with very basic understanding"}
              </Text>
            </div>

            <Text ta="center" mb="xl">
              You answered {score} out of {questions.length} questions
              correctly.
            </Text>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleCloseResults}
            style={{
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              color: "white",
              fontSize: "1.2rem",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              marginTop: "2rem",
            }}
            component={motion.button}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size="xl" />
        <Text>Loading quiz questions...</Text>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <Text>No questions available. Please try again later.</Text>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <Card className={styles.welcomeContainer} shadow="sm" p="lg">
            <Title mt="md" order={1} className={styles.welcomeTitle}>
              Language Proficiency Quiz
            </Title>
            <div className={styles.welcomeContent}>
              <Title order={2}>Test Your Language Skills</Title>
              <Text>
                This quiz will assess your language proficiency level from A1
                (beginner) to C1 (advanced).
              </Text>
              <div className={styles.levelExplanation}>
                <Title c="rgb(251, 207, 232)" order={3}>
                  Proficiency Levels:
                </Title>
                <ul>
                  <li>
                    <Text>
                      C1: Advanced proficiency with near-native fluency
                    </Text>
                  </li>
                  <li>
                    <Text mt="-1rem">
                      B2: Upper intermediate level with good fluency
                    </Text>
                  </li>
                  <li>
                    <Text mt="-1rem">
                      B1: Intermediate level with functional fluency
                    </Text>
                  </li>
                  <li>
                    <Text mt="-1rem">
                      A2: Elementary level with basic communication skills
                    </Text>
                  </li>
                  <li>
                    <Text mt="-1rem">
                      A1: Beginner level with very basic understanding
                    </Text>
                  </li>
                </ul>
              </div>
              <div>
                <Title c="rgb(251, 207, 232)" order={3}>
                  Instructions:
                </Title>
                <Text mt="md">
                  Select the correct answer for each question. Your score will
                  determine your proficiency level.
                </Text>
              </div>
            </div>
            <Button
              size="lg"
              className={styles.welcomeButton}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                uiClick.play();
                setShowWelcome(false);
              }}
            >
              Start Quiz
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          {showResults ? (
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 2,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ResultsScreen />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                maxWidth: "800px",
              }}
            >
              <Card className={styles.quizContainer} shadow="sm" p="lg">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Title
                    ta="center"
                    mt="xl"
                    mb="xl"
                    order={3}
                    className={styles.questionText}
                  >
                    {questions[currentQuestionIndex].question}
                  </Title>
                  <div
                    className={
                      questions[currentQuestionIndex].options.every(
                        (option) => option.text.length < 15,
                      )
                        ? styles.optionsGrid
                        : styles.optionsContainer
                    }
                  >
                    {questions[currentQuestionIndex].options.map(
                      (option, index) => {
                        const prefix = String.fromCharCode(65 + index) + ".";
                        return (
                          <Button
                            c="black"
                            variant="outline"
                            key={index}
                            className={`${styles.optionButton} ${
                              selectedOption === option.id
                                ? isCorrect
                                  ? styles.correctOption
                                  : styles.incorrectOption
                                : showFeedback
                                  ? styles.unselectedOption
                                  : ""
                            }`}
                            component={motion.button}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option.id)}
                            disabled={showFeedback}
                          >
                            <span className={styles.optionText}>
                              {prefix} {option.text}
                            </span>
                          </Button>
                        );
                      },
                    )}
                  </div>
                </motion.div>
                {showFeedback && (
                  <motion.div
                    className={`${styles.feedback} ${
                      isCorrect
                        ? styles.correctFeedback
                        : styles.incorrectFeedback
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Text>
                      {isCorrect
                        ? "Correct, good job!"
                        : `Incorrect. The correct answer is: ${
                            questions[currentQuestionIndex].options.find(
                              (opt) =>
                                opt.id ===
                                questions[currentQuestionIndex].correctAnswer,
                            )?.text || "N/A"
                          }`}
                    </Text>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
