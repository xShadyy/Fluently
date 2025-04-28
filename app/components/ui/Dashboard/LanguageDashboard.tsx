"use client";

import {
  Card,
  Title,
  Text,
  Grid,
  Progress,
  RingProgress,
  Group,
  Stack,
  Button,
  Modal,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconClock,
  IconTarget,
  IconTrophy,
  IconPlus,
  IconLock,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import styles from "./LanguageDashboard.module.css";
import React from "react";

const LanguageDashboard = () => {
  const [stats, setStats] = useState({
    totalWordsLearned: 1250,
    dailyGoal: 75,
    currentStreak: 12,
    accuracyRate: 92,
    timeSpent: "0h 0m",
    nextMilestone: "2000 words",
    proficiencyLevel: "B2",
    weeklyProgress: [
      { day: "Mon", value: 80 },
      { day: "Tue", value: 65 },
      { day: "Wed", value: 90 },
      { day: "Thu", value: 75 },
      { day: "Fri", value: 85 },
      { day: "Sat", value: 70 },
      { day: "Sun", value: 95 },
    ],
    skillBreakdown: [
      { skill: "Reading", value: 85 },
      { skill: "Writing", value: 75 },
      { skill: "Listening", value: 90 },
      { skill: "Speaking", value: 80 },
    ],
  });

  const [achievements] = useState([
    {
      id: "beginner_quiz",
      title: "Beginner Master",
      desc: "Complete the Beginner Words Quiz",
    },
    {
      id: "intermediate_quiz",
      title: "Intermediate Expert",
      desc: "Complete the Intermediate Words Quiz",
    },
    {
      id: "advanced_quiz",
      title: "Advanced Champion",
      desc: "Complete the Advanced Words Quiz",
    },
  ]);

  const [completions, setCompletions] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
  });

  const [showAddWordsModal, setShowAddWordsModal] = useState(false);
  const [newWords, setNewWords] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/quiz/achievements/check")
      .then((res) => res.json())
      .then((data) => {
        const completedDifficulties = data.completions
          ? data.completions.map((c: any) => c.difficulty?.toLowerCase())
          : [];

        setCompletions({
          beginner: completedDifficulties.includes("beginner"),
          intermediate: completedDifficulties.includes("intermediate"),
          advanced: completedDifficulties.includes("advanced"),
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("learningStartTime");
    if (saved) setStartTime(new Date(saved));
    else {
      const now = new Date();
      setStartTime(now);
      localStorage.setItem("learningStartTime", now.toISOString());
    }
  }, []);

  useEffect(() => {
    if (!startTime) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setStats((prev) => ({ ...prev, timeSpent: `${hours}h ${minutes}m` }));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleAddWords = () => {
    if (newWords > 0) {
      setStats((prev) => ({
        ...prev,
        totalWordsLearned: prev.totalWordsLearned + newWords,
        dailyGoal: Math.min(100, prev.dailyGoal + 10),
      }));
      setNewWords(0);
      setShowAddWordsModal(false);
    }
  };

  const accentColor = "rgb(251, 207, 232)";
  const glowStyle = { boxShadow: `0 0 8px ${accentColor}` };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.dashboardContent}>
          <Grid gutter="xl">
            <Grid.Col span={3}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.card}
              >
                <Group justify="space-between" mb="xs">
                  <Title order={3} className={styles.cardTitle}>
                    Words Learned
                  </Title>
                  <Button
                    variant="subtle"
                    color="pink"
                    size="xs"
                    onClick={() => setShowAddWordsModal(true)}
                    leftSection={<IconPlus size={16} />}
                  >
                    Add
                  </Button>
                </Group>
                <Text size="xl" fw={700} className={styles.statsValue}>
                  {stats.totalWordsLearned}
                </Text>
                <Progress
                  value={(stats.totalWordsLearned / 2000) * 100}
                  color={accentColor}
                  size="lg"
                  radius="xl"
                  className={styles.progressBar}
                />
                <Text size="sm" mt="sm">
                  Next milestone: {stats.nextMilestone}
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={3}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.card}
              >
                <Group justify="space-between" mb="xs">
                  <Title order={3} className={styles.cardTitle}>
                    Daily Goal
                  </Title>
                  <IconTarget size={24} color={accentColor} />
                </Group>
                <Text size="xl" fw={700} className={styles.statsValue}>
                  {stats.dailyGoal}%
                </Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[{ value: stats.dailyGoal, color: accentColor }]}
                  label={
                    <Text
                      size="xs"
                      ta="center"
                      px="xs"
                      style={{ pointerEvents: "none", color: "white" }}
                    >
                      Today
                    </Text>
                  }
                />
              </Card>
            </Grid.Col>

            <Grid.Col span={3}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.card}
              >
                <Group justify="space-between" mb="xs">
                  <Title order={3} className={styles.cardTitle}>
                    Current Streak
                  </Title>
                  <IconTrophy size={24} color={accentColor} />
                </Group>
                <Text size="xl" fw={700} className={styles.statsValue}>
                  {stats.currentStreak} days
                </Text>
                <Text size="sm">Keep it up! 🔥</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={3}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.card}
              >
                <Group justify="space-between" mb="xs">
                  <Title order={3} className={styles.cardTitle}>
                    Time Spent
                  </Title>
                  <IconClock size={24} color={accentColor} />
                </Group>
                <Text size="xl" fw={700} className={styles.statsValue}>
                  {stats.timeSpent}
                </Text>
                <Text size="sm">Total learning time</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={8}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.skillCard}
              >
                <Title order={3} className={styles.skillTitle}>
                  Skill Breakdown
                </Title>
                <Stack className={styles.skillList}>
                  {stats.skillBreakdown.map((skill) => (
                    <div key={skill.skill}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>{skill.skill}</Text>
                        <Text fw={700}>{skill.value}%</Text>
                      </Group>
                      <Progress
                        value={skill.value}
                        color={accentColor}
                        size="lg"
                        radius="xl"
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={4}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.skillCard}
              >
                <Title order={3} className={styles.skillTitle}>
                  Weekly Progress
                </Title>
                <Stack className={styles.weeklyProgress}>
                  {stats.weeklyProgress.map((day) => (
                    <div key={day.day}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>{day.day}</Text>
                        <Text fw={700}>{day.value}%</Text>
                      </Group>
                      <Progress
                        value={day.value}
                        color={accentColor}
                        size="sm"
                        radius="xl"
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={12}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                className={styles.skillCard}
              >
                <Title order={3} className={styles.skillTitle}>
                  Word Quiz Achievements
                </Title>
                <Grid>
                  {achievements.map((a) => {
                    const key = a.id.split("_")[0] as keyof typeof completions;
                    const unlocked = completions[key];
                    return (
                      <Grid.Col span={4} key={a.id}>
                        <Card
                          padding="md"
                          radius="md"
                          className={`${styles.achievementCard} ${!unlocked ? styles.lockedAchievement : ""}`}
                          style={unlocked ? glowStyle : undefined}
                        >
                          <div className={styles.achievementContent}>
                            <div className={styles.achievementIcon}>
                              {unlocked ? (
                                <IconTrophy size={24} color={accentColor} />
                              ) : (
                                <IconLock size={24} color={accentColor} />
                              )}
                            </div>
                            <Text size="lg" className={styles.achievementTitle}>
                              {a.title}
                            </Text>
                            {!unlocked && (
                              <Text
                                size="sm"
                                className={styles.achievementDesc}
                              >
                                {a.desc}
                              </Text>
                            )}
                          </div>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Card>
            </Grid.Col>
          </Grid>
        </div>
      </motion.div>

      <Modal
        opened={showAddWordsModal}
        onClose={() => setShowAddWordsModal(false)}
        title="Add New Words"
        centered
        classNames={{ root: styles.modalRoot, title: styles.modalTitle }}
      >
        <Stack>
          <Text>How many new words did you learn today?</Text>
          <input
            type="number"
            value={newWords}
            onChange={(e) => setNewWords(Number(e.target.value))}
            className={styles.wordInput}
          />
          <Button
            onClick={handleAddWords}
            variant="gradient"
            gradient={{ from: accentColor, to: accentColor }}
          >
            Add Words
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default LanguageDashboard;
