"use client";
import { useState, useEffect } from "react";
import { correct, wrong, completed, uiClick } from "@/app/utils/sound";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./ProficiencyQuiz.module.css";
import { Button, Loader, Card, Text, Title } from "@mantine/core";

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

interface LanguageQuizProps {
  onComplete?: (score: number, level: string) => void;
}

export default function ProficiencyQuiz({ onComplete }: LanguageQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showResults, setShowResults] = useState(false);

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

  const completeQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
    completed.play();
    triggerConfetti();
    if (onComplete) {
      onComplete(score, getLanguageLevel());
    }
  };

  useEffect(() => {
    if (quizCompleted && showResults) {
      const timer = setTimeout(() => {
        setShowResults(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [quizCompleted, showResults]);

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
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
        >
          <Card className={styles.welcomeContainer} shadow="sm" p="lg">
            <Title mt="md" order={1} className={styles.welcomeTitle}>
              Language Proficiency Quiz
            </Title>
            <div className={styles.welcomeContent}>
              <Title order={2}>Test Your Language Skills</Title>
              <Text>
                This quiz will assess your language proficiency level from A1
                (beginner) to C1 (advanced). You'll
              </Text>
              <Text mt="-1rem">
                answer {questions.length} questions about grammar, vocabulary,
                and comprehension.
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
                <Text mt="-1rem">
                  You'll receive immediate feedback after each answer.
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
      ) : quizCompleted ? (
        showResults && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={styles.resultContainer} shadow="sm">
              <Title c="black" order={2}>
                Quiz Completed!
              </Title>
              <div
                className={styles.scoreCircle}
                style={
                  {
                    "--percentage": `${Math.round((score / questions.length) * 100)}%`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.scoreValue}>
                  {Math.round((score / questions.length) * 100)}%
                </div>
              </div>
              <div className={styles.resultDetails}>
                <Text>
                  You scored <strong>{score}</strong> out of{" "}
                  <strong>{questions.length}</strong> points
                </Text>
                <Title order={3}>Your language proficiency level:</Title>
                <div className={styles.levelBadge}>{getLanguageLevel()}</div>
                <Text className={styles.levelDescription}>
                  {getLanguageLevel() === "C1" &&
                    "Advanced proficiency with near-native fluency"}
                  {getLanguageLevel() === "B2" &&
                    "Upper intermediate level with good fluency"}
                  {getLanguageLevel() === "B1" &&
                    "Intermediate level with functional fluency"}
                  {getLanguageLevel() === "A2" &&
                    "Elementary level with basic communication skills"}
                  {getLanguageLevel() === "A1" &&
                    "Beginner level with very basic understanding"}
                </Text>
              </div>
            </Card>
          </motion.div>
        )
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={styles.quizContainer} shadow="sm" p="lg">
            <Text mt="md" c="black" ta="center" fw="700" size="1.7rem">
              Question {currentQuestionIndex + 1} out of {questions.length}
            </Text>
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
            {showFeedback && (
              <motion.div
                className={`${styles.feedback} ${
                  isCorrect ? styles.correctFeedback : styles.incorrectFeedback
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
    </AnimatePresence>
  );
}
