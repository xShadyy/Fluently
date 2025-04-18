import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./WordsQuizDifficulty.module.css";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { toast } from "react-hot-toast";
import { uiClick, unlocked } from "@/utils/sound";

type Difficulty = "beginner" | "intermediate" | "advanced";

export default function WordsQuizDifficulty() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [quizCompletions, setQuizCompletions] = useState<any[]>([]);
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<Set<Difficulty>>(
    new Set<Difficulty>(["beginner"]),
  );
  const [isUnlocking, setIsUnlocking] = useState<Difficulty | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const [completionRes, achievementsRes] = await Promise.all([
          fetch("/api/quiz/completion", { credentials: "include" }),
          fetch("/api/quiz/achievements/check", { credentials: "include" }),
        ]);
        const completion = await completionRes.json();
        const achievements = await achievementsRes.json();

        const raw =
          sessionStorage.getItem("unlockedQuizzes") ||
          JSON.stringify(["beginner"]);
        const sessionUnlocked = JSON.parse(raw) as Difficulty[];
        const unlockedSet = new Set<Difficulty>(sessionUnlocked);

        if (!completion.beginner && !completion.intermediate) {
          sessionStorage.removeItem("unlockedQuizzes");
          unlockedSet.clear();
          unlockedSet.add("beginner");
        } else {
          sessionStorage.setItem(
            "unlockedQuizzes",
            JSON.stringify(Array.from(unlockedSet)),
          );
        }

        setUnlockedQuizzes(unlockedSet);
        setQuizCompletions(achievements.completions || []);
      } catch (err) {
        console.error("Error loading quiz state:", err);
      }
    };
    loadState();
  }, []);

  const hasCompletedBeginner = quizCompletions.some(
    (c) => c.difficulty === "BEGINNER",
  );
  const hasCompletedIntermediate = quizCompletions.some(
    (c) => c.difficulty === "INTERMEDIATE",
  );

  const isQuizLocked = (d: Difficulty) => !unlockedQuizzes.has(d);
  const isQuizUnlockable = (d: Difficulty) => {
    if (d === "intermediate")
      return hasCompletedBeginner && !unlockedQuizzes.has("intermediate");
    if (d === "advanced")
      return hasCompletedIntermediate && !unlockedQuizzes.has("advanced");
    return false;
  };

  const handleUnlock = (d: Difficulty) => {
    if (!isQuizUnlockable(d)) return;
    unlocked.play();
    setIsUnlocking(d);
    setTimeout(() => {
      setUnlockedQuizzes((prev) => {
        const next = new Set(prev).add(d);
        sessionStorage.setItem(
          "unlockedQuizzes",
          JSON.stringify(Array.from(next)),
        );
        return next;
      });
      setIsUnlocking(null);
    }, 1000);
  };

  const handleCardClick = (d: Difficulty) => {
    if (isQuizUnlockable(d)) {
      handleUnlock(d);
    } else if (!isQuizLocked(d)) {
      uiClick.play();
      setSelectedDifficulty(d);
    } else {
      toast.error("Complete the previous quiz first!");
    }
  };

  const handleConfirm = () => {
    if (selectedDifficulty) {
      router.push(`/dashboard/words/${selectedDifficulty}`);
    }
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
        {(["beginner", "intermediate", "advanced"] as Difficulty[]).map(
          (d, i) => {
            const locked = isQuizLocked(d);
            const unlockable = isQuizUnlockable(d);
            const unlocking = isUnlocking === d;
            const selected = selectedDifficulty === d;

            return (
              <motion.div
                key={d}
                data-difficulty={d}
                className={[
                  styles.card,
                  locked ? styles.locked : "",
                  unlockable ? styles.unlockable : "",
                  unlocking ? styles.unlocking : "",
                  selected ? styles.selected : "",
                ].join(" ")}
                onClick={() => handleCardClick(d)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <MdSchool size={40} />
                  </div>
                  <h3>{d.charAt(0).toUpperCase() + d.slice(1)}</h3>
                  <p>
                    {d === "beginner"
                      ? "Start your journey"
                      : d === "intermediate"
                        ? "Challenge yourself"
                        : "Master your skills"}
                  </p>
                  {selected && !locked && (
                    <motion.button
                      className={
                        d === "beginner"
                          ? styles.confirmButtonBeginner
                          : d === "intermediate"
                            ? styles.confirmButtonIntermediate
                            : styles.confirmButtonAdvanced
                      }
                      onClick={handleConfirm}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Start Quiz
                    </motion.button>
                  )}
                </div>

                {(locked || unlockable || unlocking) && (
                  <div className={styles.lockOverlay}>
                    <FaLock size={30} />
                    {(locked || unlockable) && !unlocking && (
                      <p className={styles.lockText}>
                        {d === "intermediate"
                          ? "Complete Beginner first"
                          : d === "advanced"
                            ? "Complete Intermediate first"
                            : ""}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          },
        )}
      </motion.div>

      <motion.button
        className={styles.backButton}
        onClick={() => router.push("/dashboard/words")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
      >
        <FaArrowLeft /> Back to Dashboard
      </motion.button>
    </motion.div>
  );
}
