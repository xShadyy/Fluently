import Sidemenu from "../Static/SideMenu/SideMenu";
import DashboardHeader from "../Static/UserHeader/UserHeader";
import WordsQuiz from "../WordsQuiz/WordsQuiz";
import styles from "./WordsQuizGrouped.module.css";

export default function DashRoot() {
  return (
    <div className={styles.container}>
      <DashboardHeader />
      <div className={styles.main}>
        <Sidemenu />
        <div className={styles.content}>
          <WordsQuiz />
        </div>
      </div>
    </div>
  );
}
