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
  IconAward,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./SideMenu.module.css";

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
  { icon: <IconHome size={20} stroke={1.5} />, label: "Dashboard" },
  { icon: <IconBook size={20} stroke={1.5} />, label: "Lessons" },
  { icon: <IconLanguage size={20} stroke={1.5} />, label: "Languages" },
  { icon: <IconAward size={20} stroke={1.5} />, label: "Achievements" },
  { icon: <IconChartBar size={20} stroke={1.5} />, label: "Progress" },
  { icon: <IconUser size={20} stroke={1.5} />, label: "Profile" },
  { icon: <IconSettings size={20} stroke={1.5} />, label: "Settings" },
];

export function Sidebar() {
  const [active, setActive] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const links = navItems.map((item, index) => (
    <NavbarLink
      {...item}
      key={item.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div
        style={{
          width: collapsed ? 80 : 300,
          padding: "16px",
        }}
        className={classes.navbar}
      >
        <div className={classes.sidebarContent}>
          <div className={classes.header}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Text size="xl" fw={700} className={classes.logo}>
                  Menu
                </Text>
              </motion.div>
            )}
            <UnstyledButton
              onClick={() => setCollapsed(!collapsed)}
              className={classes.collapseBtn}
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                <IconChevronRight size={20} stroke={1.5} />
              </motion.div>
            </UnstyledButton>
          </div>
          <div className={classes.linksContainer}>{links}</div>
        </div>

        <div className={classes.footer}>
          <NavbarLink
            icon={<IconLogout size={20} stroke={1.5} />}
            label="Logout"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Sidebar;
