"use client";

import { useSession } from "next-auth/react";
import { LoadingOverlay, Center, Text } from "@mantine/core";
import Translator from "../../components/ui/Translator/Translator";

export default function TranslatorPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Center>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </Center>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Center>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div>
          <Text size="xl" c="red" fw={600} mb="md">
            Error
          </Text>
          <Text>You must be signed in to use the translator</Text>
        </div>
      </Center>
    );
  }

  return <Translator />;
}
