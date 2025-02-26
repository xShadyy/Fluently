import { useState, useEffect } from "react";
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
import styles from "./test.module.css";

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

export default function LanguageTest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions?game=EnglishGrammarQuiz"); 
        const data = await res.json();

        if (res.ok) {
          const formattedQuestions: Question[] = data.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: q.options.map((opt: any) => ({
              id: opt.id,
              text: opt.text,
            })),
            correctOptionId: q.correctAnswer.optionId,
          }));

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

  if (loading) {
    return <Text>Loading questions...</Text>;
  }

  if (questions.length === 0) {
    return <Text>No questions available.</Text>;
  }

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
      }

      setSelectedAnswer(null);
    }, 1000);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.resultContainer}
      >
        <Paper shadow="md" p="xl" className={styles.questionCard}>
          <Title order={2} mb="md">Quiz Complete!</Title>
          <Text size="xl" mb="md">Your Score: {score} out of {questions.length}</Text>
          <Progress value={(score / questions.length) * 100} size="xl" mb="xl" />
          <Button onClick={restart} size="lg">Try Again</Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Container className={styles.quizContainer}>
      <Progress value={(currentQuestion / questions.length) * 100} size="sm" mb="xl" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper shadow="md" p="xl" className={styles.questionCard}>
            <Title order={3} mb="xl">Question {currentQuestion + 1}</Title>
            <Text size="lg" mb="xl">{questions[currentQuestion].text}</Text>
            <Stack gap="md">
              {questions[currentQuestion].options.map((option) => (
                <motion.div key={option.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    size="lg"
                    variant={
                      selectedAnswer === option.id
                        ? option.id === questions[currentQuestion].correctOptionId
                          ? "filled"
                          : "light"
                        : "outline"
                    }
                    color={
                      selectedAnswer === option.id
                        ? option.id === questions[currentQuestion].correctOptionId
                          ? "green"
                          : "red"
                        : "blue"
                    }
                    onClick={() => !selectedAnswer && handleAnswer(option.id)}
                  >
                    {option.text}
                  </Button>
                </motion.div>
              ))}
            </Stack>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
