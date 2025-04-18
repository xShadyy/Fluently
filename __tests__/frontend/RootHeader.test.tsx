import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import Header from "@/components/ui/RootHeader/RootHeader";

// Mock the CSS module
vi.mock("./RootHeader.module.css", () => ({
  container: "container-mock",
  header: "header-mock",
  centerSection: "centerSection-mock",
  dot: "dot-mock",
}));

// Mock framer-motion to properly handle animation props
vi.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    a: React.forwardRef(({ children, ...props }, ref) => {
      // Filter out framer-motion specific props
      const { whileHover, whileTap, initial, animate, transition, ...htmlProps } = props;
      return <a ref={ref} {...htmlProps}>{children}</a>;
    }),
  },
}));

describe("Header component", () => {
  test("renders without crashing", () => {
    render(
      <MantineProvider>
        <Header />
      </MantineProvider>
    );

    // Check if logo is rendered
    const logo = screen.getByAltText("Fluently Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/fluently-clean-wh.png");
  });

  test("displays 'Made by @xShadyy' text", () => {
    render(
      <MantineProvider>
        <Header />
      </MantineProvider>
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
      </MantineProvider>
    );

    // Check for all social media links
    const expectedLinks = [
      "https://www.instagram.com/g80.shadyy/",
      "https://www.linkedin.com/in/tymoteusz-netter/",
      "https://github.com/xShadyy"
    ];

    // Get all links in the document
    const allLinks = screen.getAllByRole("link");
    
    // Count the social media links separately from the author link
    // The author link has the text "@xShadyy" while social links don't have text content
    const socialMediaLinks = allLinks.filter(link => 
      expectedLinks.includes(link.getAttribute("href") || "") && 
      !link.textContent?.includes("@xShadyy")
    );
    
    // Verify we have all three social links (Instagram, LinkedIn, GitHub)
    expect(socialMediaLinks.length).toBe(3);
    
    // Verify each expected link exists
    expectedLinks.forEach(expectedHref => {
      // Find the link with this href
      const matchingLinks = allLinks.filter(link => 
        link.getAttribute("href") === expectedHref
      );
      
      // We should have at least one link with this href
      // (there may be more than one if the GitHub link appears twice)
      expect(matchingLinks.length).toBeGreaterThan(0);
      
      // For the first matching link, verify attributes
      const link = matchingLinks[0];
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});