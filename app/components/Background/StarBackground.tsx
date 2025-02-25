"use client";

import { useEffect, useRef } from "react";
import styles from "./StarBackground.module.css";

interface ParticleProps {
  x: number;
  y: number;
  size: number;
}

class Particle {
  initialLifeSpan: number;
  lifeSpan: number;
  velocity: { x: number; y: number };
  position: { x: number; y: number };
  size: number;

  constructor(x: number, y: number) {
    this.initialLifeSpan = Math.floor(Math.random() * 60 + 80);
    this.lifeSpan = this.initialLifeSpan;
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      y: 1 + Math.random(),
    };
    this.position = { x, y };
    this.size = 3;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.lifeSpan--;

    this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
    this.velocity.y -= Math.random() / 300;

    const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);
    const opacity = scale * 0.8;

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.size * scale,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

interface StarBackgroundProps {
  starCount?: number;
  starColor?: string;
  backgroundColor?: string;
}

export default function StarBackground({
  starCount = 30,
  starColor = "rgba(255, 255, 255, 0.8)",
  backgroundColor = "#0a0a0a",
}: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    const stars: ParticleProps[] = [];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
        });
      }
    };

    const addParticle = (x: number, y: number) => {
      particles.push(new Particle(x, y));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addParticle(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        addParticle(x, y);
      }
    };

    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      gradient.addColorStop(0, "rgba(200, 162, 200, 0.1)");
      gradient.addColorStop(0.4, "rgba(100, 162, 255, 0.05)");
      gradient.addColorStop(0.6, "rgba(144, 238, 144, 0.05)");
      gradient.addColorStop(0.9, "rgba(0, 0, 0, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.09)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = starColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      particles = particles.filter((particle) => {
        particle.update(ctx);
        return particle.lifeSpan > 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    window.addEventListener("resize", initCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", initCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
    };
  }, [starCount, starColor, backgroundColor]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
