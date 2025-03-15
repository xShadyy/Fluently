'use client';

import { useState, useEffect, useRef } from "react";
import {
  Paper,
  Button,
  Title,
  Text,
  Progress,
  Container,
  Stack,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./ProficiencyQuiz.module.css";
import { bubblePop } from "../../../utils/sound";
import { victory } from "../../../utils/sound";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export default function ProficiencyQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultVisible, setResultVisible] = useState(true);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const GRID_LETTER_LIMIT = 15;
  
  const progressValue = (currentQuestion / questions.length) * 100;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/proficiencyquiz");
        const data = await res.json();

        if (res.ok) {
          const formattedQuestions: Question[] = data.questions.map(
            (q: any) => ({
              id: q.id,
              text: q.text,
              options: q.options.map((opt: any) => ({
                id: opt.id,
                text: opt.text,
              })),
              correctOptionId: q.correctAnswer?.optionId || "",
            })
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

  useEffect(() => {
    if (showResult && resultRef.current) {
      const rect = resultRef.current.getBoundingClientRect();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        }
      });
      victory.play()
    }
  }, [showResult]);

  const getLanguageLevel = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "C1";
    if (percentage >= 75) return "B2";
    if (percentage >= 50) return "B1";
    if (percentage >= 25) return "A2";
    return "A1";
  };

  if (loading) {
    return <Text>Loading questions...</Text>;
  }

  if (questions.length === 0) {
    return <Text>No questions available.</Text>;
  }

  const currentOptions = questions[currentQuestion].options;
  const allShortAnswers = currentOptions.every(
    (option) => option.text.trim().length <= GRID_LETTER_LIMIT
  );

  const handleAnswer = (selectedOptionId: string) => {
    setSelectedAnswer(selectedOptionId);

    setTimeout(() => {
      if (selectedOptionId === questions[currentQuestion].correctOptionId) {
        setScore((prevScore) => prevScore + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
        setTimeout(() => {
          setResultVisible(false);
        }, 6000);
      }
      setSelectedAnswer(null);
    }, 1000);
  };

  if (showResult) {
    const languageLevel = getLanguageLevel(score, questions.length);
    return (
      <AnimatePresence>
        {resultVisible && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.resultContainer}
          >
            <Paper shadow="md" p="xl" className={styles.resultCard}>
              <Title order={2} mb="md">
                Quiz Complete!
              </Title>
              <Text size="xl" mb="md">
                Your Score: {score} out of {questions.length}
              </Text>
              <Text size="xl" mb="md">
                Your predicted language Level: {languageLevel}
              </Text>
              <Progress
                value={(score / questions.length) * 100}
                size="xl"
                mb="xl"
              />
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Container className={styles.quizContainer}>
      
      <Progress
        color="lightblue"
        value={progressValue}
        size="xl"
        radius="md"
        animated
        className={styles.progressBar}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper shadow="md" p="xl" className={styles.questionCard}>
            <Title c="black" order={3} mb="xl">
              QUESTION {currentQuestion + 1}
            </Title>
            <Text c="black" size="lg" mb="xl" fw="500">
              {questions[currentQuestion].text}
            </Text>
            {allShortAnswers ? (
              <div className={styles.optionsGrid}>
                {currentOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fw="700"
                      fullWidth
                      size="lg"
                      variant="outline"
                      color="black"
                      styles={() => ({
                        root: {
                          borderWidth: 2,
                        },
                      })}
                      onClick={() => {
                        if (!selectedAnswer) {
                          bubblePop.play();
                          handleAnswer(option.id);
                        }
                      }}
                    >
                      {option.text}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Stack gap="md">
                {currentOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fw="700"
                      fullWidth
                      size="lg"
                      variant="outline"
                      color="black"
                      styles={() => ({
                        root: {
                          borderWidth: 2,
                        },
                      })}
                      onClick={() => {
                        if (!selectedAnswer) {
                          bubblePop.play();
                          handleAnswer(option.id);
                        }
                      }}
                    >
                      {option.text}
                    </Button>
                  </motion.div>
                ))}
              </Stack>
            )}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
