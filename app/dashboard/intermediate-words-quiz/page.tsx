"use client";

import { useState, useEffect } from "react";
import Sidemenu from "../../components/ui/SideMenu/SideMenu";
import UserHeader from "../../components/ui/UserHeader/UserHeader";
import IntermediateWordsQuiz from "../../components/ui/IntermediateWordsQuiz/IntermediateWordsQuiz";
import styles from "./page.module.css";

export default function IntermediateWordsQuizPage() {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <UserHeader disableAnimation={!initialLoad} />
      <div className={styles.main}>
        <Sidemenu disableAnimation={!initialLoad} />
        <div className={styles.content}>
          <IntermediateWordsQuiz />
        </div>
      </div>
    </div>
  );
}
