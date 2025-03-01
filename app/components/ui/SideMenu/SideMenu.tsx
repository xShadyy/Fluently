'use client';

import { useState } from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconBook,
  IconHome,
  IconSettings,
  IconUser,
  IconChevronRight,
  IconLanguage,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./SideMenu.module.css";
import { useRouter } from "next/navigation";
import { uiClick } from "../../../utils/sound";

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <UnstyledButton
        onClick={onClick}
        className={`${classes.link} ${active ? classes.active : ""}`}
      >
        <Group gap="md">
          <div
            className={`${classes.iconWrapper} ${active ? classes.activeIcon : ""}`}
          >
            {icon}
          </div>
          <Text size="sm" fw={500} className={classes.linkLabel}>
            {label}
          </Text>
        </Group>
        <IconChevronRight size={16} className={classes.chevron} />
      </UnstyledButton>
    </motion.div>
  );
}

const navItems = [
  { icon: <IconHome size={20} stroke={1.5} />, label: "Dashboard", path: "dashboard" },
  { icon: <IconBook size={20} stroke={1.5} />, label: "Lessons", path: "dashboard/lessons" },
  { icon: <IconLanguage size={20} stroke={1.5} />, label: "Words", path: "dashboard/words" },
  { icon: <IconUser size={20} stroke={1.5} />, label: "Profile", path: "dashboard/profile" },
  { icon: <IconSettings size={20} stroke={1.5} />, label: "Settings", path: "dashboard/settings" },
];

export function Sidebar() {
  const [active, setActive] = useState(0);
  const router = useRouter();

  const links = navItems.map((item, index) => (
    <NavbarLink
      {...item}
      key={item.label}
      active={index === active}
      onClick={() => {
        uiClick.play();
        setActive(index);
        router.push(item.path);
      }}
    />
  ));

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div
        style={{
          width: 250,
          padding: "16px",
        }}
        className={classes.navbar}
      >
        <div className={classes.sidebarContent}>
          <div className={classes.linksContainer}>{links}</div>
        </div>

        <div className={classes.footer}>
          <NavbarLink
            icon={<IconLogout size={20} stroke={1.5} />}
            label="Logout"
            onClick={() => {
              uiClick.play();
              handleLogout();
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Sidebar;