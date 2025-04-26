"use client";
import { useState, useEffect } from "react";
import Header from "./components/ui/RootHeader/RootHeader";
import Root from "./components/ui/RootContents/RootContents";
import styles from "./page.module.css";
import Spline from "@splinetool/react-spline";

export default function HomePage() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js";
    document.body.appendChild(script);

    setTimeout(() => {
      setStartAnimation(true);
    }, 2000);

    return () => {
      if (script && document.body && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <div
        className={`${styles.splineContainer} ${startAnimation ? styles.moveLeft : ""}`}
      >
        <Spline scene="https://prod.spline.design/IV4HnLV5h5pOmWxH/scene.splinecode" />
      </div>

      <div
        className={`${styles.rootContainer} ${startAnimation ? styles.showRoot : ""}`}
      >
        <Root />
      </div>
    </div>
  );
}
