"use client";

import BeginnerWordsQuiz from "../../../components/ui/BeginnerWordsQuiz/BeginnerWordsQuiz";
import styles from "./page.module.css";

export default function BeginnerWordsQuizPage() {
  return (
    <div className={styles.quizContainer}>
      <BeginnerWordsQuiz />
    </div>
  );
}
