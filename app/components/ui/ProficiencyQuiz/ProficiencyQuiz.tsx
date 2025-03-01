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
import styles from "./ProficiencyQuiz.module.css";
import { bubblePop } from "../../../utils/sound";

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
  const progressValue = (currentQuestion / questions.length) * 100;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions?game=EnglishGrammarQuiz");
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
              correctOptionId: q.correctAnswer.optionId,
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

  if (showResult) {
    const languageLevel = getLanguageLevel(score, questions.length);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <Text c="black" size="lg" mb="xl" fw="700">
              {questions[currentQuestion].text}
            </Text>
            <Stack gap="md">
              {questions[currentQuestion].options.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fw="500"
                    fullWidth
                    size="lg"
                    variant="outline"
                    color="black"
                    styles={(theme) => ({
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
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
