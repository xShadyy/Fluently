"use client";

import { Card, Text, Button, Group } from "@mantine/core";
import { useState } from "react";

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceGameProps {
  question: string;
  options: Option[];
  correctOptionId: string;
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultipleChoiceGame({
  question,
  options,
  correctOptionId,
  onAnswer,
}: MultipleChoiceGameProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (id: string) => {
    if (!isAnswered) {
      setSelectedOptionId(id);
    }
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsAnswered(true);
    onAnswer(selectedOptionId === correctOptionId);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>
        {question}
      </Text>
      <Group style={{ gap: "0.75rem" }}>
        {options.map((option) => {
          const isCorrect = option.id === correctOptionId;
          const isSelected = option.id === selectedOptionId;
          let bgColor = "transparent";

          if (isAnswered) {
            if (isCorrect) {
              bgColor = "#C6F6D5";
            } else if (isSelected && !isCorrect) {
              bgColor = "#FED7D7";
            }
          }

          return (
            <Button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              style={{ backgroundColor: bgColor }}
              disabled={isAnswered}
              fullWidth
              variant="outline"
            >
              {option.text}
            </Button>
          );
        })}
      </Group>
      <Button
        onClick={handleSubmit}
        disabled={isAnswered || !selectedOptionId}
        style={{ marginTop: "1rem" }}
        fullWidth
      >
        Submit Answer
      </Button>
    </Card>
  );
}
