import React from "react";
import { render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import MultipleChoiceGame from "@/components/ui/MultipleChoiceGame/MultipleChoiceGame";

test("MultipleChoiceGame renders without crashing", () => {
  render(
    <MantineProvider>
      <MultipleChoiceGame
        question="What is the capital of France?"
        options={[
          { id: "1", text: "Paris" },
          { id: "2", text: "London" },
        ]}
        correctOptionId="1"
        onAnswer={() => {}}
      />
    </MantineProvider>,
  );
});
