/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Button,
  Loader,
  Text,
  Title,
  Progress,
  Container,
  Group,
  Stack
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { correct, wrong, completed, uiClick } from "@/app/utils/sound";
import styles from "./AdvancedWordsQuiz.module.css";

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

export default function BeginnerWordsQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizOver, setQuizOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
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
      } finally {
        setLoading(false);
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
    if (optionId === null) {
      wrong.play();
      const correctText =
        currentQ.options.find(
          (opt) => opt.id === currentQ.correctAnswer?.wordsOptionId
        )?.text || "N/A";
      setFeedback(`Time expired! The correct answer is: ${correctText}`);
      setLives((prev) => prev - 1);
    } else if (isAnswerCorrect) {
      correct.play();
      setScore((prev) => prev + 1);
      setFeedback("Correct, good job!");
    } else {
      wrong.play();
      const correctText =
        currentQ.options.find(
          (opt) => opt.id === currentQ.correctAnswer?.wordsOptionId
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
        lives - (optionId === null || isAnswerCorrect ? 0 : 1) <= 0 ||
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
    setLoading(true);
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
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <Loader size="xl" />
        <Text>Loading quiz questions...</Text>
      </Container>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className={styles.resultContainer} shadow="sm">
            <Title c="black" mb="lg">
              Challenge completed! 🎉
            </Title>
            <Container
              className={styles.scoreCircle}
              component={motion.div}
              style={{
                "--percentage": `${Math.round((score / questions.length) * 100)}%`
              } as React.CSSProperties}
              fluid
            >
              <Text className={styles.scoreValue}>
                {Math.round((score / questions.length) * 100)}%
              </Text>
            </Container>
            <Container className={styles.resultDetails} fluid>
              <Text>
                You scored <strong>{score}</strong> out of{" "}
                <strong>{questions.length}</strong> points
              </Text>
              <Title order={3}>Your performance:</Title>
              <Container className={styles.levelBadge} fluid>
                {getRating()}
              </Container>
              <Text className={styles.levelDescription}>
                {getRating() === "Excellent" && "Excellent performance!"}
                {getRating() === "Great" && "Great job!"}
                {getRating() === "Good" && "Good effort!"}
                {getRating() === "Fair" && "Keep practicing!"}
                {getRating() === "Needs Improvement" &&
                  "Needs improvement, try again!"}
              </Text>
                <Group mt="2rem" className={styles.resetButton}>
                <Button
                  size="md"
                  onClick={() => {
                  uiClick.play();
                  resetQuiz();
                  }}
                  style={{ backgroundColor: "darkgray", color: "black" }}
                >
                  Try Again
                </Button>
                </Group>
            </Container>
          </Card>
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
                    <Container className={`${styles.circle} ${circleClass}`} fluid>
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
                <Title ta="center" mt="xl" mb="xl" order={3} className={styles.questionText}>
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
                            ? option.id === questions[currentQuestion].correctAnswer?.wordsOptionId
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
                    selectedAnswer === questions[currentQuestion].correctAnswer?.wordsOptionId
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