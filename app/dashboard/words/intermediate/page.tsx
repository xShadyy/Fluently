"use client";

import IntermediateWordsQuiz from "../../../components/ui/IntermediateWordsQuiz/IntermediateWordsQuiz";
import styles from "./page.module.css";

export default function IntermediateWordsQuizPage() {
  return (
    <div className={styles.quizContainer}>
      <IntermediateWordsQuiz />
    </div>
  );
}
