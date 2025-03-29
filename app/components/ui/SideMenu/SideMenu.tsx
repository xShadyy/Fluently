import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Group, Text, UnstyledButton } from "@mantine/core";
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
  disableAnimation?: boolean;
}

function NavbarLink({
  icon,
  label,
  active,
  onClick,
  disableAnimation,
}: NavbarLinkProps) {
  const Wrapper = disableAnimation ? "div" : motion.div;

  return (
    <Wrapper
      {...(!disableAnimation && {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
      })}
    >
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
    </Wrapper>
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
    label: "Materials",
    path: "/dashboard/materials",
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
    label: "Translator",
    path: "/dashboard/translator",
  },
];

export function SideMenu({
  disableAnimation = false,
}: {
  disableAnimation?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const Wrapper = disableAnimation ? "div" : motion.div;

  const activeNav = navItems.reduce(
    (prev, item) => {
      if (pathname.startsWith(item.path)) {
        if (!prev || item.path.length > prev.path.length) {
          return item;
        }
      }
      return prev;
    },
    null as (typeof navItems)[0] | null,
  );

  return (
    <Wrapper
      {...(!disableAnimation && {
        initial: { x: -300 },
        animate: { x: 0 },
        transition: { type: "spring", stiffness: 100 },
      })}
    >
      <div className={classes.navbar} style={{ width: 250, padding: "16px" }}>
        <div className={classes.sidebarContent}>
          <div className={classes.linksContainer}>
            {navItems.map((item) => (
              <NavbarLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeNav?.path === item.path}
                onClick={() => {
                  uiClick.play();
                  router.push(item.path);
                }}
                disableAnimation={disableAnimation}
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
            disableAnimation={disableAnimation}
          />
        </div>
      </div>
    </Wrapper>
  );
}

export default SideMenu;
