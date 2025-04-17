"use client";

import AdvancedWordsQuiz from "../../../components/ui/AdvancedWordsQuiz/AdvancedWordsQuiz";
import styles from "./page.module.css";

export default function AdvancedWordsQuizPage() {
  return (
    <div className={styles.quizContainer}>
      <AdvancedWordsQuiz />
    </div>
  );
}
