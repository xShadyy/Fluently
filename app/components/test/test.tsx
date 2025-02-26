import { useState } from "react";
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

const questions = [
  {
    question: 'What is the past tense of "go"?',
    options: ["goed", "went", "gone", "going"],
    correct: "went",
  },
  {
    question: 'Which word is a synonym for "happy"?',
    options: ["sad", "joyful", "angry", "tired"],
    correct: "joyful",
  },
  {
    question: 'Choose the correct article: "___ university is nearby."',
    options: ["a", "an", "the", "no article"],
    correct: "the",
  },
  {
    question: 'What is the plural of "child"?',
    options: ["childs", "childes", "children", "child"],
    correct: "children",
  },
  {
    question: "Which is the correct spelling?",
    options: ["recieve", "receive", "receeve", "receve"],
    correct: "receive",
  },
  {
    question: 'What is the opposite of "brave"?',
    options: ["cowardly", "strong", "fierce", "bold"],
    correct: "cowardly",
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "She don't like coffee",
      "She doesn't likes coffee",
      "She doesn't like coffee",
      "She not like coffee",
    ],
    correct: "She doesn't like coffee",
  },
  {
    question: 'What is the comparative form of "good"?',
    options: ["gooder", "more good", "better", "goodder"],
    correct: "better",
  },
  {
    question: "Which word is a preposition?",
    options: ["run", "under", "quickly", "happy"],
    correct: "under",
  },
  {
    question: 'Choose the correct conditional: "If it rains, I ___ stay home."',
    options: ["will", "would", "shall", "should"],
    correct: "will",
  },
];

const getLevel = (score: number) => {
  if (score >= 9)
    return {
      level: "Advanced (C1-C2)",
      description: "Excellent! You have advanced English skills.",
    };
  if (score >= 7)
    return {
      level: "Upper Intermediate (B2)",
      description: "Great job! You have strong English skills.",
    };
  if (score >= 5)
    return {
      level: "Intermediate (B1)",
      description: "Good! You have intermediate English skills.",
    };
  if (score >= 3)
    return {
      level: "Elementary (A2)",
      description: "You have basic English skills.",
    };
  return {
    level: "Beginner (A1)",
    description: "Keep practicing! You're at a beginner level.",
  };
};

export default function LanguageTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);

    setTimeout(() => {
      if (answer === questions[currentQuestion].correct) {
        setScore(score + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
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
    const result = getLevel(score);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.resultContainer}
      >
        <Paper shadow="md" p="xl" className={styles.questionCard}>
          <Title order={2} mb="md">
            Quiz Complete!
          </Title>
          <Text size="xl" mb="md">
            Your Score: {score} out of {questions.length}
          </Text>
          <Progress
            value={(score / questions.length) * 100}
            size="xl"
            mb="xl"
            className={styles.progressBar}
          />
          <Title order={3} mb="sm">
            {result.level}
          </Title>
          <Text mb="xl">{result.description}</Text>
          <Button
            onClick={restart}
            size="lg"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Try Again
          </Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Container className={styles.quizContainer}>
      <Progress
        value={(currentQuestion / questions.length) * 100}
        size="sm"
        mb="xl"
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
            <Title order={3} mb="xl">
              Question {currentQuestion + 1}
            </Title>
            <Text size="lg" mb="xl">
              {questions[currentQuestion].question}
            </Text>
            <Stack gap="md">
              {questions[currentQuestion].options.map((option) => (
                <motion.div
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    size="lg"
                    variant={
                      selectedAnswer === option
                        ? option === questions[currentQuestion].correct
                          ? "filled"
                          : "light"
                        : "outline"
                    }
                    color={
                      selectedAnswer === option
                        ? option === questions[currentQuestion].correct
                          ? "green"
                          : "red"
                        : "blue"
                    }
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    className={styles.answerButton}
                  >
                    {option}
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
