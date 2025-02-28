import Sidebar from "../SideMenu/SideMenu";
import Navbar from "../DashboardHeader/DashboardHeader";
import ProficiencyQuiz from "../ProficiencyQuiz/ProficiencyQuiz";
import styles from "./DashboardContent.module.css";

export default function DashRoot() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.content}>
          <ProficiencyQuiz />
        </div>
      </div>
    </div>
  );
}
