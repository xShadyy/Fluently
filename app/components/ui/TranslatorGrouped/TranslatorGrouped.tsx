import Sidemenu from "../SideMenu/SideMenu";
import UserHeader from "../UserHeader/UserHeader";
import Translator from "../Translator/Translator";
import styles from "./TranslatorGrouped.module.css";

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
          <Translator />
        </div>
      </div>
    </div>
  );
}
