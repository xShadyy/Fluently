import React from "react";
import styles from "./PlainBG.module.css";

const PlainBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className={styles.background}>{children}</div>;
};

export default PlainBG;
