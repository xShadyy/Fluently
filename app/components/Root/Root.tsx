'use client';
import { useRouter } from "next/navigation";
import { Container, Button } from "@mantine/core";
import styles from "./Root.module.css";

const Root = () => {
  const router = useRouter();

  return (
    <Container className={styles.root}>
      <h1 className={styles.title}>
        Expand your knowledge
        <br />
        in a blink of an eye
      </h1>
      <p className={styles.subtitle}>
        Fluently is an app to help your education
        <br />
        and broaden your horizons.
      </p>

      <Button
        className={styles.button}
        onClick={() => router.push("/login")}
        style={{
            backgroundColor: "rgb(251, 207, 232)",
            color: "black",
            fontSize: (20), 
            transition: "all 0.3s ease",
            borderRadius: (6),
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgb(251, 207, 232)";
            e.currentTarget.style.color = "rgb(164, 96, 227)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(147, 51, 234, 0.5)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgb(251, 207, 232)";
            e.currentTarget.style.color = "black";
            e.currentTarget.style.boxShadow = "none";
        }}
        w="200px"
        h="60px"
        >
        Get Started
    </Button>

    </Container>
  );
};

export default Root;
