import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import Header from "@/components/ui/RootHeader/RootHeader";

vi.mock("./RootHeader.module.css", () => ({
  container: "container-mock",
  header: "header-mock",
  centerSection: "centerSection-mock",
  dot: "dot-mock",
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
    a: React.forwardRef(({ children, ...props }, ref) => {
      const {
        whileHover,
        whileTap,
        initial,
        animate,
        transition,
        ...htmlProps
      } = props;
      return (
        <a ref={ref} {...htmlProps}>
          {children}
        </a>
      );
    }),
  },
}));

describe("Header component", () => {
  test("renders without crashing", () => {
    render(
      <MantineProvider>
        <Header />
      </MantineProvider>,
    );

    const logo = screen.getByAltText("Fluently Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/fluently-clean-wh.png");
  });

  test("displays 'Made by @xShadyy' text", () => {
    render(
      <MantineProvider>
        <Header />
      </MantineProvider>,
    );

    expect(screen.getByText("Made by")).toBeInTheDocument();
    const authorLink = screen.getByText("@xShadyy");
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute("href", "https://github.com/xShadyy");
  });

  test("renders all social media links", () => {
    render(
      <MantineProvider>
        <Header />
      </MantineProvider>,
    );

    const expectedLinks = [
      "https://www.instagram.com/g80.shadyy/",
      "https://www.linkedin.com/in/tymoteusz-netter/",
      "https://github.com/xShadyy",
    ];

    const allLinks = screen.getAllByRole("link");

    const socialMediaLinks = allLinks.filter(
      (link) =>
        expectedLinks.includes(link.getAttribute("href") || "") &&
        !link.textContent?.includes("@xShadyy"),
    );

    expect(socialMediaLinks.length).toBe(3);

    expectedLinks.forEach((expectedHref) => {
      const matchingLinks = allLinks.filter(
        (link) => link.getAttribute("href") === expectedHref,
      );

      expect(matchingLinks.length).toBeGreaterThan(0);

      const link = matchingLinks[0];
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
