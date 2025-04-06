import Sidemenu from "../SideMenu/SideMenu";
import UserHeader from "../UserHeader/UserHeader";
import IntermediateWordsQuiz from "../IntermediateWordsQuiz/IntermediateWordsQuiz";
import styles from "./IntermediateWordsQuizGrouped.module.css";
import React from "react";

interface DashRootProps {
  disableAnimation?: boolean;
}

export default function DashRoot({ disableAnimation = false }: DashRootProps) {
  return (
    <div className={styles.container}>
      <UserHeader disableAnimation={disableAnimation} />
      <div className={styles.main}>
        <Sidemenu disableAnimation={disableAnimation} />
        <div className={styles.content}>
          <IntermediateWordsQuiz />
        </div>
      </div>
    </div>
  );
}
