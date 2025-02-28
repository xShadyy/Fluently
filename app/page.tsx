"use client";
import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import StarBackground from "./components/ui/Background/StarBackground";
import Header from "./components/ui/Header/Header";
import Root from "./components/ui/RootContents/RootContents";
import styles from "./page.module.css";

export default function HomePage() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <div className={`${styles.splineContainer} ${startAnimation ? styles.moveLeft : ""}`}>
        <Spline scene="https://prod.spline.design/IV4HnLV5h5pOmWxH/scene.splinecode" />
      </div>
      <div className={`${styles.rootContainer} ${startAnimation ? styles.showRoot : ""}`}>
        <Root />
      </div>
    </div>
  );
}
