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
  Badge,
  Button,
  Modal,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBook,
  IconClock,
  IconTarget,
  IconTrophy,
  IconPlus,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import styles from "./LanguageDashboard.module.css";
import { error } from "@/utils/sound";

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

  const [achievements, setAchievements] = useState([
    {
      id: "beginner_quiz",
      title: "Beginner Master",
      desc: "Complete the Beginner Words Quiz",
      icon: <IconTrophy size={24} />,
      locked: true,
      progress: 0,
    },
    {
      id: "intermediate_quiz",
      title: "Intermediate Expert",
      desc: "Complete the Intermediate Words Quiz",
      icon: <IconTrophy size={24} />,
      locked: true,
      progress: 0,
    },
    {
      id: "advanced_quiz",
      title: "Advanced Champion",
      desc: "Complete the Advanced Words Quiz",
      icon: <IconTrophy size={24} />,
      locked: true,
      progress: 0,
    },
  ]);

  const [showAddWordsModal, setShowAddWordsModal] = useState(false);
  const [newWords, setNewWords] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null);
  const [shakingAchievement, setShakingAchievement] = useState<string | null>(null);
  const [unlockingAchievement, setUnlockingAchievement] = useState<string | null>(null);

  // Initialize start time from localStorage or set new one
  useEffect(() => {
    const savedStartTime = localStorage.getItem("learningStartTime");
    if (savedStartTime) {
      setStartTime(new Date(savedStartTime));
    } else {
      const newStartTime = new Date();
      setStartTime(newStartTime);
      localStorage.setItem("learningStartTime", newStartTime.toISOString());
    }
  }, []);

  // Update time spent every second
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setStats((prev) => ({
        ...prev,
        timeSpent: `${hours}h ${minutes}m`,
      }));
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

  const handleAchievementHover = (achievementId: string) => {
    setHoveredAchievement(achievementId);
  };

  const handleAchievementLeave = () => {
    setHoveredAchievement(null);
  };

  const handleAchievementClick = (achievementId: string) => {
    if (shakingAchievement || unlockingAchievement) return;

    setShakingAchievement(achievementId);
    error.play();
    setTimeout(() => {
      setShakingAchievement(null);
    }, 1000);
  };

  const accentColor = "rgb(251, 207, 232)";
  const accentColorDark = "rgb(255, 105, 180)";

  return (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.content}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.dashboardContent}>
                <Grid gutter="xl">
                  {/* Main Stats Cards */}
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
                      <Text size="sm" c="dimmed" mt="sm">
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
                        sections={[
                          { value: stats.dailyGoal, color: accentColor },
                        ]}
                        label={
                          <Text
                            size="xs"
                            ta="center"
                            px="xs"
                            style={{ pointerEvents: "none" }}
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
                      <Text size="sm" c="dimmed">
                        Keep it up! 🔥
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
                          Time Spent
                        </Title>
                        <IconClock size={24} color={accentColor} />
                      </Group>
                      <Text size="xl" fw={700} className={styles.statsValue}>
                        {stats.timeSpent}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Total learning time
                      </Text>
                    </Card>
                  </Grid.Col>

                  {/* Skill Breakdown */}
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
                              <Group>
                                <Text fw={700}>{skill.value}%</Text>
                              </Group>
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

                  {/* Weekly Progress */}
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

                  {/* Quiz Achievements Section */}
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
                        {achievements.map((achievement) => (
                          <Grid.Col span={4} key={achievement.id}>
                            <Card
                              padding="md"
                              radius="md"
                              className={`${styles.achievementCard} ${achievement.locked ? styles.lockedAchievement : ""}`}
                            >
                              <div className={styles.achievementContent}>
                                {achievement.locked ? (
                                  <motion.div
                                    className={styles.lockedIcon}
                                    onHoverStart={() => handleAchievementHover(achievement.id)}
                                    onHoverEnd={handleAchievementLeave}
                                    onClick={() => handleAchievementClick(achievement.id)}
                                    animate={{
                                      rotate: hoveredAchievement === achievement.id ? 15 : 0,
                                      scale: hoveredAchievement === achievement.id ? 1.1 : 1,
                                      color: shakingAchievement === achievement.id ? "rgb(255, 0, 0)" : "rgb(128, 128, 128)",
                                      x: shakingAchievement === achievement.id 
                                        ? [0, -20, 20, -20, 20, -15, 15, -10, 10, -5, 5, 0] 
                                        : 0,
                                    }}
                                    transition={{ 
                                      duration: 0.2,
                                      x: { 
                                        duration: 0.6,
                                        repeat: 0,
                                        ease: "easeInOut"
                                      }
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <AnimatePresence mode="wait">
                                      {unlockingAchievement === achievement.id ? (
                                        <motion.div
                                          key="unlocking"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <IconLockOpen size={32} />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="locked"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <IconLock size={32} />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                ) : (
                                  achievement.icon
                                )}
                                <Title
                                  order={4}
                                  className={styles.achievementTitle}
                                >
                                  {achievement.title}
                                </Title>
                                <Text
                                  size="sm"
                                  className={styles.achievementDesc}
                                >
                                  {achievement.desc}
                                </Text>
                                {!achievement.locked && (
                                  <Progress
                                    value={achievement.progress}
                                    color={accentColor}
                                    size="sm"
                                    radius="xl"
                                    className={styles.achievementProgress}
                                  />
                                )}
                              </div>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Card>
                  </Grid.Col>
                </Grid>
              </div>
            </motion.div>
          </div>
        </div>

        <Modal
          opened={showAddWordsModal}
          onClose={() => setShowAddWordsModal(false)}
          title="Add New Words"
          centered
          classNames={{
            root: styles.modalRoot,
            title: styles.modalTitle,
          }}
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
              gradient={{ from: accentColor, to: accentColorDark }}
            >
              Add Words
            </Button>
          </Stack>
        </Modal>
      </div>
    </>
  );
};

export default LanguageDashboard;
