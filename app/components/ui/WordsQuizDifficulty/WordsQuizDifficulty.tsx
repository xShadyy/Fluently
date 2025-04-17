import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Flame, Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./WordsQuizDifficulty.module.css";
import { uiClick } from "@/utils/sound";
import React from "react";

interface DifficultySelectorProps {
  onSelect?: (difficulty: "beginner" | "intermediate" | "advanced") => void;
}

export default function WordsQuiz({
  onSelect = () => {},
}: DifficultySelectorProps) {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "intermediate" | "advanced" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (
    difficulty: "beginner" | "intermediate" | "advanced",
  ) => {
    if (selectedDifficulty === difficulty) return;
    setSelectedDifficulty(difficulty);
  };

  const handleConfirm = () => {
    if (selectedDifficulty) {
      setIsLoading(true);
      onSelect(selectedDifficulty);
      router.push(`/dashboard/words/${selectedDifficulty}`);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        Select Your Difficulty
      </motion.h2>

      <motion.div
        className={styles.cardsContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        {["beginner", "intermediate", "advanced"].map((difficulty, index) => (
          <motion.div
            key={difficulty}
            className={`${styles.card} ${selectedDifficulty === difficulty ? styles.selected : ""}`}
            data-difficulty={difficulty}
            onClick={() =>
              uiClick.play() &&
              handleSelect(
                difficulty as "beginner" | "intermediate" | "advanced",
              )
            }
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.7,
                delay: 0.6 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            whileHover={{
              scale: 1.02,
              y: -5,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            whileTap={{
              scale: 0.98,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
          >
            <motion.div
              className={styles.cardContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.15,
                ease: "easeOut",
              }}
            >
              <motion.div
                className={styles.iconContainer}
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                  transition: {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
              >
                {difficulty === "beginner" && <Zap size={40} />}
                {difficulty === "intermediate" && <Flame size={40} />}
                {difficulty === "advanced" && <Skull size={40} />}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.9 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                {difficulty === "beginner"
                  ? "Start your journey with basic challenges"
                  : difficulty === "intermediate"
                    ? "Face greater challenges with increased difficulty"
                    : "Only for the brave. Ultimate challenge"}
              </motion.p>
              {selectedDifficulty === difficulty && (
                <motion.button
                  className={
                    styles[
                      `confirmButton${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`
                    ]
                  }
                  onClick={() => {
                    handleConfirm();
                    uiClick.play();
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.1,
                      ease: "easeOut",
                    },
                  }}
                >
                  Confirm
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        className={styles.backButton}
        onClick={handleGoBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 1.2,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        }}
        whileTap={{
          scale: 0.95,
          transition: {
            duration: 0.1,
            ease: "easeOut",
          },
        }}
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </motion.button>
    </motion.div>
  );
}
