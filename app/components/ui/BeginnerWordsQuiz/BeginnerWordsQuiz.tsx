import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Button,
  Title,
  Text,
  Progress,
  Stack,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BeginnerWordsQuiz.module.css";

interface Option {
  id: string;
  text: string;
}

interface CorrectAnswer {
  optionId: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswer: CorrectAnswer | null;
}

export default function WordsQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizOver, setQuizOver] = useState(false);
  const [resultVisible, setResultVisible] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/wordsquiz/beginner");
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error("Error fetching questions:", data.error);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (quizOver || questions.length === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null, true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [currentQuestion, quizOver, questions]);

  const handleAnswer = (optionId: string | null, timeExpired = false) => {
    if (selectedAnswer) return;
    setSelectedAnswer(optionId);
    const isCorrect =
      !timeExpired &&
      optionId === questions[currentQuestion].correctAnswer?.optionId;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
    setTimeout(() => {
      if (
        lives - (isCorrect ? 0 : 1) <= 0 ||
        currentQuestion === questions.length - 1
      ) {
        setQuizOver(true);
        setTimeout(() => setResultVisible(false), 6000);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
      }
    }, 1000);
  };

  const getRating = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Great";
    if (percentage >= 50) return "Good";
    if (percentage >= 25) return "Fair";
    return "Needs Improvement";
  };

  if (questions.length === 0) {
    return <div className={styles.loading}>Loading questions...</div>;
  }

  if (quizOver) {
    return (
      <AnimatePresence>
        {resultVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.resultContainer}
          >
            <Paper shadow="md" p="xl" className={styles.resultCard}>
              <Title order={2}>Quiz Complete!</Title>
              <Text size="xl">
                Your Score: {score} out of {questions.length}
              </Text>
              <Text size="xl">Performance: {getRating()}</Text>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Container className={styles.quizContainer}>
      <Progress
        value={(currentQuestion / questions.length) * 100}
        size="xl"
        className={styles.progressBar}
      />

      <div className={styles.roadmap}>
        {questions.map((_, index) => (
          <div key={index} className={styles.roadmapItem}>
            <div
              className={`${styles.circle} ${index === currentQuestion ? styles.active : ""}`}
            >
              {index + 1}
            </div>
            {index < questions.length - 1 && <div className={styles.line} />}
          </div>
        ))}
      </div>

      <div className={styles.lives}>
        {Array.from({ length: lives }).map((_, index) => (
          <span key={index} className={styles.heart}>
            ❤️
          </span>
        ))}
      </div>

      <div className={styles.timer}>Time Left: {timeLeft}s</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questions[currentQuestion].id}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.questionCard}
        >
          <Title order={3}>Question {currentQuestion + 1}</Title>
          <Text size="lg" mt="md">
            {questions[currentQuestion].text}
          </Text>
          <Stack gap="md" mt="xl">
            {questions[currentQuestion].options.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    if (!selectedAnswer) handleAnswer(option.id);
                  }}
                  disabled={selectedAnswer !== null}
                >
                  {option.text}
                </Button>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
