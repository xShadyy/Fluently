"use client";

import { useState, useEffect } from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
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
  {
    icon: <IconHome size={20} stroke={1.5} />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <IconBook size={20} stroke={1.5} />,
    label: "Lessons",
    path: "/dashboard/lessons",
  },
  {
    icon: <IconLanguage size={20} stroke={1.5} />,
    label: "Words",
    path: "/dashboard/words",
  },
  {
    icon: <IconUser size={20} stroke={1.5} />,
    label: "Profile",
    path: "/dashboard/profile",
  },
  {
    icon: <IconSettings size={20} stroke={1.5} />,
    label: "Settings",
    path: "/dashboard/settings",
  },
];

export function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className={classes.navbar} style={{ width: 250, padding: "16px" }}>
        <div className={classes.sidebarContent}>
          <div className={classes.linksContainer}>
            {navItems.map((item) => (
              <NavbarLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={pathname === item.path}
                onClick={() => {
                  uiClick.play();
                  router.push(item.path);
                }}
              />
            ))}
          </div>
        </div>

        <div className={classes.footer}>
          <NavbarLink
            icon={<IconLogout size={20} stroke={1.5} />}
            label="Logout"
            onClick={() => {
              uiClick.play();
              router.push("/login");
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SideMenu;
