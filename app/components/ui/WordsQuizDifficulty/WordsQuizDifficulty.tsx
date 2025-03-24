import { useState } from "react";
import { motion } from "framer-motion";
import { Skull, Flame, Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./WordsQuizDifficulty.module.css";
import { uiClick } from "@/app/utils/sound";

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

  const handleSelect = (
    difficulty: "beginner" | "intermediate" | "advanced",
  ) => {
    if (selectedDifficulty === difficulty) return;
    setSelectedDifficulty(difficulty);
  };

  const handleConfirm = () => {
    if (selectedDifficulty) {
      onSelect(selectedDifficulty);
      router.push(`/dashboard/words/${selectedDifficulty}`);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div
          className={`${styles.bgGradient} ${
            selectedDifficulty
              ? styles[
                  `bg${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}`
                ]
              : ""
          }`}
        ></div>
      </div>

      <h2 className={styles.title}>Select Your Difficulty</h2>

      <div className={styles.cardsContainer}>
        {["beginner", "intermediate", "advanced"].map((difficulty) => (
          <motion.div
            key={difficulty}
            className={`${styles.card} ${selectedDifficulty === difficulty ? styles.selected : ""}`}
            onClick={() =>
              uiClick.play() &&
              handleSelect(
                difficulty as "beginner" | "intermediate" | "advanced",
              )
            }
            whileHover={{
              scale: 1.05,
              boxShadow:
                difficulty === "beginner"
                  ? "0 0 25px rgba(0, 255, 255, 0.5)"
                  : difficulty === "intermediate"
                    ? "0 0 25px rgba(255, 100, 100, 0.6)"
                    : "0 0 25px rgba(255, 0, 0, 0.7)",
            }}
            animate={{
              y: [0, -10, 0],
              transition: {
                duration:
                  difficulty === "beginner"
                    ? 4
                    : difficulty === "intermediate"
                      ? 5
                      : 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay:
                  difficulty === "beginner"
                    ? 0
                    : difficulty === "intermediate"
                      ? 0.5
                      : 1,
              },
            }}
          >
            <div className={styles.cardContent}>
              <motion.div
                className={styles.iconContainer}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                {difficulty === "beginner" ? (
                  <Zap className={styles.beginnerIcon} size={48} />
                ) : difficulty === "intermediate" ? (
                  <Flame className={styles.intermediateIcon} size={48} />
                ) : (
                  <Skull className={styles.advancedIcon} size={48} />
                )}
              </motion.div>
              <h3>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </h3>
              <p>
                {difficulty === "beginner"
                  ? "Start your journey with basic challenges"
                  : difficulty === "intermediate"
                    ? "Face greater challenges with increased difficulty"
                    : "Only for the brave. Ultimate challenge"}
              </p>
              {selectedDifficulty === difficulty && (
                <button
                  className={
                  styles[
                    `confirmButton${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`
                  ]
                  }
                  onClick={() => {
                  handleConfirm();
                  uiClick.play();
                  }}
                >
                  Confirm
                </button>
              )}
            </div>
            <div className={styles.cardOverlay}></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
