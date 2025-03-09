"use client";

import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Button, Group, Box } from "@mantine/core";
import WordsContent from "@/app/components/ui/WordsQuizGrouped/WordsQuizGrouped";

export default function Dashboard() {

  return <WordsContent />;
  
}
