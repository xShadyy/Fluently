/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  Button,
  Loader,
  Text,
  Title,
  Progress,
  Container,
  Group,
  Stack,
} from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { correct, wrong, completed, uiClick } from "@/utils/sound";
import styles from "./AdvancedWordsQuiz.module.css";
import React from "react";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  text: string;
}

interface CorrectAnswer {
  wordsOptionId: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswer: CorrectAnswer | null;
}

export default function AdvancedWordsQuiz() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizOver, setQuizOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/wordsquiz/advanced");
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error("Error fetching questions:", data.error);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const currentOptions = useMemo(() => {
    if (questions.length === 0) return [];
    const opts = [...questions[currentQuestion].options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [currentQuestion, questions]);

  const handleOptionSelect = (optionId: string | null) => {
    if (selectedAnswer || showFeedback) return;
    const currentQ = questions[currentQuestion];
    const isAnswerCorrect = optionId === currentQ.correctAnswer?.wordsOptionId;

    if (isAnswerCorrect) {
      correct.play();
      setScore((prev) => prev + 1);
      setFeedback("Correct, good job!");
    } else {
      wrong.play();
      const correctText =
        currentQ.options.find(
          (opt) => opt.id === currentQ.correctAnswer?.wordsOptionId,
        )?.text || "N/A";
      setFeedback(`Incorrect. The correct answer is: ${correctText}`);
      setLives((prev) => prev - 1);
    }

    setResults((prev) => [...prev, isAnswerCorrect]);
    setSelectedAnswer(optionId);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback(null);
      if (
        lives - (isAnswerCorrect ? 0 : 1) <= 0 ||
        currentQuestion === questions.length - 1
      ) {
        setQuizOver(true);
        completed.play();
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setQuizOver(false);
    setShowFeedback(false);
    setFeedback(null);
    setResults([]);
    (async () => {
      try {
        const res = await fetch("/api/wordsquiz/advanced");
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error("Error fetching questions:", data.error);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    })();
  };

  const getRating = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Great";
    if (percentage >= 50) return "Good";
    if (percentage >= 25) return "Fair";
    return "Needs Improvement";
  };

  const handleCloseResults = () => {
    router.push("/dashboard/words");
  };

  const triggerConfetti = useCallback(() => {
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
  }, []);

  const completeQuiz = async () => {
    setShowResults(true);
    completed.play();
    triggerConfetti();

    const percentage = Math.round((score / questions.length) * 100);

    try {
      const response = await fetch("/api/quiz/achievements/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: "ADVANCED",
          score: percentage,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to update quiz achievement");
      }
    } catch (error) {
      console.error("Error updating quiz achievement:", error);
    }
  };

  if (isLoading) {
    return (
      <Container className={styles.errorContainer}>
        <Text size="xl" ta="center" fw={700}>
          Loading...
        </Text>
      </Container>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Container className={styles.errorContainer}>
        <Text>No questions available. Please try again later.</Text>
      </Container>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {quizOver ? (
        <motion.div
          key="result"
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
            style={{
              width: "90%",
              maxWidth: "600px",
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, #4CAF50 ${Math.round((score / questions.length) * 100)}%, #f0f0f0 ${Math.round((score / questions.length) * 100)}%)`,
              }}
            />

            <Title
              order={2}
              ta="center"
              mb="xl"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#2c3e50",
                marginBottom: "2rem",
              }}
            >
              Quiz Results
            </Title>

            <div
              style={
                {
                  width: "200px",
                  height: "200px",
                  margin: "0 auto 2rem",
                  position: "relative",
                  background:
                    "conic-gradient(#4CAF50 0% var(--percentage), #f0f0f0 var(--percentage) 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "--percentage": `${Math.round((score / questions.length) * 100)}%`,
                } as React.CSSProperties
              }
            >
              <div
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#4CAF50",
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              <Text
                size="xl"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#2c3e50",
                  marginBottom: "0.5rem",
                }}
              >
                Your performance level is:
              </Text>
              <Text
                size="xl"
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#4CAF50",
                  textTransform: "uppercase",
                }}
              >
                {getRating()}
              </Text>
            </div>

            <Text
              ta="center"
              style={{
                fontSize: "1.1rem",
                color: "#666",
                marginBottom: "2rem",
              }}
            >
              You answered {score} out of {questions.length} questions
              correctly.
            </Text>

            <Group mt="2rem" className={styles.resetButton}>
              <Button
                size="md"
                onClick={handleCloseResults}
                style={{ backgroundColor: "#4CAF50", color: "white" }}
              >
                Go Back
              </Button>
            </Group>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={styles.quizContainer} shadow="sm" p="lg">
            <Group justify="flex-end" mb="md">
              <Button
                size="xs"
                variant="outline"
                color="gray"
                onClick={() => {
                  setQuizOver(true);
                  completed.play();
                  completeQuiz();
                }}
              >
                Skip to End (Testing)
              </Button>
            </Group>

            <Progress
              value={(currentQuestion / questions.length) * 100}
              size="xl"
              className={styles.progressBar}
            />
            <Group className={styles.roadmap} gap={0}>
              {questions.map((_, index) => {
                let circleClass = "";
                if (index < currentQuestion) {
                  circleClass = results[index]
                    ? styles.completedCircle
                    : styles.incorrectCompleted;
                } else if (index === currentQuestion) {
                  circleClass = styles.active;
                } else {
                  circleClass = styles.futureCircle;
                }
                return (
                  <Group key={index} className={styles.roadmapItem} gap={0}>
                    <Container
                      className={`${styles.circle} ${circleClass}`}
                      fluid
                    >
                      {index + 1}
                    </Container>
                    {index < questions.length - 1 && (
                      <Container className={styles.line} fluid />
                    )}
                  </Group>
                );
              })}
            </Group>
            <Stack className={styles.statusContainer} gap="xs">
              <Group className={styles.lives} gap="xs">
                {Array.from({ length: lives }).map((_, index) => (
                  <Container key={index} className={styles.heart} fluid>
                    <img
                      src="/icons/heart.png"
                      alt="Heart icon"
                      height="64"
                      width="64"
                      className={styles.heartIcon}
                    />
                  </Container>
                ))}
              </Group>
            </Stack>
            <Text mt="md" c="black" ta="center" fw={700} size="1.7rem">
              Question {currentQuestion + 1} out of {questions.length}
            </Text>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
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
                  {questions[currentQuestion].text}
                </Title>
                <Container
                  className={
                    currentOptions.every((option) => option.text.length < 15)
                      ? styles.optionsGrid
                      : styles.optionsContainer
                  }
                  fluid
                >
                  {currentOptions.map((option, index) => {
                    const prefix = String.fromCharCode(65 + index) + ".";
                    return (
                      <Button
                        c="black"
                        variant="outline"
                        key={option.id}
                        className={`${styles.optionButton} ${
                          selectedAnswer === option.id
                            ? option.id ===
                              questions[currentQuestion].correctAnswer
                                ?.wordsOptionId
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
                        <Text className={styles.optionText}>
                          {prefix} {option.text}
                        </Text>
                      </Button>
                    );
                  })}
                </Container>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {showFeedback && feedback && (
                <motion.div
                  className={`${styles.feedback} ${
                    selectedAnswer ===
                    questions[currentQuestion].correctAnswer?.wordsOptionId
                      ? styles.correctFeedback
                      : styles.incorrectFeedback
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Text>{feedback}</Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
