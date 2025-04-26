"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown, IconExternalLink } from "@tabler/icons-react";
import { Card, Text, Title, Group, Badge, Button, Tabs } from "@mantine/core";
import styles from "./Materials.module.css";
import { getIconForType } from "../../../utils/data/resourceUtils";
import { resources, Resource } from "../../../utils/data/resources";

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className={styles.customCard}
      >
        <div
          className={styles.clickable}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <Group justify="space-between" align="center" mb="xs">
            <Group align="center">
              <div className={styles.resourceIcon}>
                {getIconForType(resource.type)}
              </div>
              <Title order={3} style={{ color: "#ffffff" }}>
                {resource.title}
              </Title>
            </Group>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={styles.rotateWrapper}
            >
              <IconChevronDown size={18} />
            </motion.div>
          </Group>

          <Group gap="xs" mt="md">
            <Badge
              color={
                resource.level === "beginner"
                  ? "green"
                  : resource.level === "intermediate"
                    ? "blue"
                    : resource.level === "advanced"
                      ? "violet"
                      : "orange"
              }
              variant="filled"
              radius="sm"
            >
              {resource.level}
            </Badge>
            <Badge
              color={
                resource.type === "reading"
                  ? "pink"
                  : resource.type === "video"
                    ? "red"
                    : resource.type === "audio"
                      ? "yellow"
                      : "teal"
              }
              variant="filled"
              radius="sm"
            >
              {resource.type}
            </Badge>
          </Group>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="description"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Text size="md" color="white" mt="md">
                {resource.description}
              </Text>
              <Group gap="xs" mt="md">
                {resource.tags.map((tag) => (
                  <Badge key={tag} size="md" color="gray" variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </Group>
              <Group align="right" mt="md">
                <Button
                  component="a"
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  variant="light"
                  color="gray"
                  leftSection={<IconExternalLink size={14} />}
                >
                  Visit Resource
                </Button>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

interface ResourceListProps {
  resources: Resource[];
  noResultsText: string;
  resetAction: () => void;
}

const ResourceList = ({
  resources,
  noResultsText,
  resetAction,
}: ResourceListProps) => (
  <div className={styles.scrollableContainer}>
    <motion.div
      className={styles.resourcesGrid}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {resources.length > 0 ? (
        resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ResourceCard resource={resource} />
          </motion.div>
        ))
      ) : (
        <div className={styles.noResults}>
          <Text size="md" color="gray">
            {noResultsText}
          </Text>
          <Button mt="md" size="md" color="gray" onClick={resetAction}>
            {noResultsText.includes("filters")
              ? "Reset Filters"
              : "Reset Level Filter"}
          </Button>
        </div>
      )}
    </motion.div>
  </div>
);

const Materials = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  const filteredResources = resources
    .filter(
      (r) =>
        (activeTab === "all" || r.type === activeTab) &&
        (levelFilter === "all" || r.level === levelFilter),
    )
    .slice(0, 8);

  const tabsData = [
    { value: "all", label: "All" },
    { value: "reading", label: "Reading", icon: getIconForType("reading") },
    { value: "video", label: "Video", icon: getIconForType("video") },
    { value: "audio", label: "Audio", icon: getIconForType("audio") },
    {
      value: "interactive",
      label: "Interactive",
      icon: getIconForType("interactive"),
    },
  ];

  const getNoResultsText = (tab: string) =>
    tab === "all"
      ? "No resources found matching your filters."
      : `No ${tab} resources found matching your level filter.`;

  const resetAction = (tab: string) =>
    tab === "all"
      ? () => {
          setActiveTab("all");
          setLevelFilter("all");
        }
      : () => setLevelFilter("all");

  return (
    <div className={styles.content}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title mb="sm" fw="700" size="3.5rem" style={{ color: "#ffffff" }}>
          English Learning Materials
        </Title>
        <Text size="1.3rem" m="auto" style={{ color: "#ffffff" }}>
          Discover the best resources to improve your English skills
        </Text>
      </motion.div>

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value ?? "all")}
        color="rgb(251, 207, 232)"
      >
        <Card
          style={{ backgroundColor: "rgb(86, 86, 86)" }}
          shadow="sm"
          p="lg"
          radius="md"
          mb="md"
        >
          <Group align="flex-start">
            <div>
              <Text fw={500} size="md" mb="xs" style={{ color: "white" }}>
                Resource Type
              </Text>
              <Tabs.List>
                {tabsData.map((tab) => (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    leftSection={tab.icon}
                  >
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </div>

            <div>
              <Text fw={500} size="md" mb="xs" style={{ color: "white" }}>
                Level
              </Text>
              <Group gap="sm">
                <Button
                  variant={levelFilter === "all" ? "filled" : "outline"}
                  size="sm"
                  color="gray"
                  onClick={() => setLevelFilter("all")}
                >
                  All Levels
                </Button>
                <Button
                  variant={levelFilter === "beginner" ? "filled" : "outline"}
                  size="sm"
                  color="green"
                  onClick={() => setLevelFilter("beginner")}
                >
                  Beginner
                </Button>
                <Button
                  variant={
                    levelFilter === "intermediate" ? "filled" : "outline"
                  }
                  size="sm"
                  color="blue"
                  onClick={() => setLevelFilter("intermediate")}
                >
                  Intermediate
                </Button>
                <Button
                  variant={levelFilter === "advanced" ? "filled" : "outline"}
                  size="sm"
                  color="violet"
                  onClick={() => setLevelFilter("advanced")}
                >
                  Advanced
                </Button>
              </Group>
            </div>
          </Group>
        </Card>

        {tabsData.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            <ResourceList
              resources={filteredResources}
              noResultsText={getNoResultsText(tab.value)}
              resetAction={resetAction(tab.value)}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default Materials;
