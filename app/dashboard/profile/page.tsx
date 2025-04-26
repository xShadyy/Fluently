"use client";

import { useSession } from "next-auth/react";
import { LoadingOverlay } from "@mantine/core";
import UserProfileData from "../../components/ui/UserProfileData/UserProfileData";

export default function ProfilePage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div>
          <h2>Error</h2>
          <p>You must be signed in to view this page</p>
        </div>
      </div>
    );
  }

  return <UserProfileData />;
}
