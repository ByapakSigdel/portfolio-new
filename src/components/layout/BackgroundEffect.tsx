'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle constellation background — sparse star nodes connected by faint lines.
 * Stars near the mouse cursor form temporary constellation connections.
 *
 * To remove: delete this file and remove <BackgroundEffect /> from MainLayout.tsx.
 */

const STAR_COUNT = 120;
const BASE_CONNECT_DIST = 180;
const MOUSE_CONNECT_DIST = 260;
const MOUSE_RADIUS = 300;
const DRIFT_SPEED = 0.12;

const BASE_LINE_ALPHA = 0.12;
const ACTIVE_LINE_ALPHA = 0.35;
const CURSOR_LINE_ALPHA = 0.25;
const STAR_ALPHA_MIN = 0.2;
const STAR_ALPHA_MAX = 0.5;
const ACTIVE_STAR_ALPHA = 0.75;

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  activation: number;
}

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function createStars(w: number, h: number): Star[] {
      const stars: Star[] = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * DRIFT_SPEED,
          vy: (Math.random() - 0.5) * DRIFT_SPEED,
          radius: Math.random() * 1.5 + 0.8,
          baseAlpha: STAR_ALPHA_MIN + Math.random() * (STAR_ALPHA_MAX - STAR_ALPHA_MIN),
          activation: 0,
        });
      }
      return stars;
    }

    function applyCanvasSize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      // Reset transform completely before applying new one
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
      dimsRef.current = { w, h };
    }

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const oldW = dimsRef.current.w;
      const oldH = dimsRef.current.h;

      applyCanvasSize(w, h);

      if (oldW === 0 || oldH === 0 || starsRef.current.length === 0) {
        // First init — fresh stars
        starsRef.current = createStars(w, h);
      } else {
        // Remap existing star positions proportionally to new dimensions
        const scaleX = w / oldW;
        const scaleY = h / oldH;
        for (const s of starsRef.current) {
          s.x *= scaleX;
          s.y *= scaleY;
        }
      }
    }

    function debouncedResize() {
      // Immediately update canvas size to prevent visual tearing
      const w = window.innerWidth;
      const h = window.innerHeight;
      applyCanvasSize(w, h);

      // Debounce the star redistribution
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        const finalW = window.innerWidth;
        const finalH = window.innerHeight;
        const oldW = dimsRef.current.w;
        const oldH = dimsRef.current.h;

        applyCanvasSize(finalW, finalH);

        if (starsRef.current.length === 0) {
          starsRef.current = createStars(finalW, finalH);
        } else if (oldW > 0 && oldH > 0) {
          const scaleX = finalW / oldW;
          const scaleY = finalH / oldH;
          for (const s of starsRef.current) {
            s.x *= scaleX;
            s.y *= scaleY;
            // Ensure star stays in bounds
            s.x = Math.max(0, Math.min(finalW, s.x));
            s.y = Math.max(0, Math.min(finalH, s.y));
          }
        }
      }, 150);
    }

    function draw() {
      const { w, h } = dimsRef.current;
      if (!ctx || w === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const stars = starsRef.current;

      // --- Update stars ---
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;

        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetActivation = dist < MOUSE_RADIUS ? 1 - dist / MOUSE_RADIUS : 0;

        if (targetActivation > s.activation) {
          s.activation += (targetActivation - s.activation) * 0.12;
        } else {
          s.activation += (targetActivation - s.activation) * 0.04;
        }
        if (s.activation < 0.001) s.activation = 0;
      }

      // --- Draw base connections ---
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < BASE_CONNECT_DIST) {
            const fade = 1 - dist / BASE_CONNECT_DIST;
            const alpha = fade * BASE_LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(0,230,57,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // --- Draw mouse-activated connections ---
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].activation <= 0) continue;
        for (let j = i + 1; j < stars.length; j++) {
          if (stars[j].activation <= 0) continue;
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_CONNECT_DIST) {
            const fade = 1 - dist / MOUSE_CONNECT_DIST;
            const act = Math.min(stars[i].activation, stars[j].activation);
            const alpha = fade * act * ACTIVE_LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(0,230,57,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Line from activated star to cursor
        if (stars[i].activation > 0.05) {
          const dx = stars[i].x - mx;
          const dy = stars[i].y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const fade = 1 - dist / MOUSE_RADIUS;
            const alpha = fade * stars[i].activation * CURSOR_LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(0,230,57,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // --- Draw stars ---
      for (const s of stars) {
        const alpha = s.baseAlpha + s.activation * (ACTIVE_STAR_ALPHA - s.baseAlpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius + s.activation * 1.0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,230,57,${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    // Initial setup
    resize();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 1 }}
    />
  );
}
