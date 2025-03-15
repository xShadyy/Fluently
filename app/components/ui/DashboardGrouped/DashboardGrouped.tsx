import Sidebar from "../SideMenu/SideMenu";
import DashboardHeader from "../UserHeader/UserHeader";
import ProficiencyQuiz from "../ProficiencyQuiz/ProficiencyQuiz";
import styles from "./DashboardGrouped.module.css";

export default function DashRoot() {
  return (
    <div className={styles.container}>
      <DashboardHeader />
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.content}>
          <ProficiencyQuiz />
        </div>
      </div>
    </div>
  );
}
