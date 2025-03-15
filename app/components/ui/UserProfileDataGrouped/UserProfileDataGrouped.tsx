import Sidemenu from "../SideMenu/SideMenu";
import UserHeader from "../UserHeader/UserHeader";
import UserProfileData from "../UserProfileData/UserProfileData";
import styles from "./UserProfileDataGrouped.module.css";

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
          <UserProfileData />
        </div>
      </div>
    </div>
  );
}
