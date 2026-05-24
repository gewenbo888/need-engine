"use client";

import { useEffect, useRef } from "react";

// ─── palette ──────────────────────────────────────────────────────────────────
const PALETTE = [
  "#ff9d3c", // ember-400
  "#ffb866", // ember-300
  "#ff3d80", // flame-500
  "#ff6ba3", // flame-400
  "#a855f7", // mind-500 (violet/dopamine)
  "#c084fc", // mind-400
  "#2dd4ee", // signal-400
  "#67e3f7", // signal-300
];

// ─── types ────────────────────────────────────────────────────────────────────
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;       // glow radius
  color: string;
  alpha: number;   // base opacity
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  t: number;       // 0 → 1 progress
  speed: number;
  color: string;
  trail: { x: number; y: number; a: number }[];
}

// ─── constants ────────────────────────────────────────────────────────────────
const NODE_COUNT        = 52;
const EDGE_THRESHOLD    = 210;   // px — draw edge if dist < this
const MAX_EDGE_ALPHA    = 0.13;
const PULSE_SPAWN_EVERY = 90;    // frames between pulse spawns
const PULSE_SPEED_MIN   = 0.006;
const PULSE_SPEED_MAX   = 0.013;
const TRAIL_LENGTH      = 18;

// ─── helpers ─────────────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function makeNode(w: number, h: number): Node {
  const speed = 0.12 + Math.random() * 0.18;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: 22 + Math.random() * 26,
    color: pick(PALETTE),
    alpha: 0.18 + Math.random() * 0.22,
  };
}

// ─── component ───────────────────────────────────────────────────────────────
export default function NeedField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── state ────────────────────────────────────────────────────────────────
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let frameCount = 0;
    let rafId = 0;
    let dpr = 1;
    let W = 0;
    let H = 0;

    // ── init canvas + nodes ──────────────────────────────────────────────────
    function init() {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width  = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = Array.from({ length: NODE_COUNT }, () => makeNode(W, H));
      pulses = [];
      frameCount = 0;
    }

    // ── spawn pulse along a random close edge ────────────────────────────────
    function spawnPulse() {
      // collect all eligible pairs
      const pairs: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < EDGE_THRESHOLD) {
            pairs.push([i, j]);
          }
        }
      }
      if (pairs.length === 0) return;
      const [a, b] = pick(pairs);
      const forward = Math.random() < 0.5;
      pulses.push({
        fromIdx: forward ? a : b,
        toIdx:   forward ? b : a,
        t: 0,
        speed: PULSE_SPEED_MIN + Math.random() * (PULSE_SPEED_MAX - PULSE_SPEED_MIN),
        color: pick(PALETTE),
        trail: [],
      });
    }

    // ── draw one frame ────────────────────────────────────────────────────────
    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // --- edges ---
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= EDGE_THRESHOLD) continue;

          const a = MAX_EDGE_ALPHA * (1 - dist / EDGE_THRESHOLD);
          ctx!.beginPath();
          ctx!.moveTo(nodes[i].x, nodes[i].y);
          ctx!.lineTo(nodes[j].x, nodes[j].y);
          ctx!.strokeStyle = `rgba(180,140,255,${a.toFixed(3)})`;
          ctx!.lineWidth = 0.6;
          ctx!.stroke();
        }
      }

      // --- pulse trails ---
      for (const p of pulses) {
        for (let k = 0; k < p.trail.length; k++) {
          const tp = p.trail[k];
          const r = 2.5 * (k / p.trail.length);
          ctx!.beginPath();
          ctx!.arc(tp.x, tp.y, Math.max(0.1, r), 0, Math.PI * 2);
          ctx!.fillStyle = p.color + Math.round(tp.a * 255).toString(16).padStart(2, "0");
          ctx!.fill();
        }
      }

      // --- nodes ---
      for (const n of nodes) {
        // radial glow
        const grad = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0,   n.color + Math.round(n.alpha * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(0.4, n.color + Math.round(n.alpha * 0.5 * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1,   n.color + "00");
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        // inner bright core dot
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = n.color + "aa";
        ctx!.fill();
      }

      // --- pulse heads ---
      for (const p of pulses) {
        const nx = lerp(nodes[p.fromIdx].x, nodes[p.toIdx].x, easeInOut(p.t));
        const ny = lerp(nodes[p.fromIdx].y, nodes[p.toIdx].y, easeInOut(p.t));

        const hg = ctx!.createRadialGradient(nx, ny, 0, nx, ny, 7);
        hg.addColorStop(0, p.color + "ee");
        hg.addColorStop(1, p.color + "00");
        ctx!.beginPath();
        ctx!.arc(nx, ny, 7, 0, Math.PI * 2);
        ctx!.fillStyle = hg;
        ctx!.fill();
      }
    }

    // ── tick ──────────────────────────────────────────────────────────────────
    function tick() {
      frameCount++;

      // move nodes with wrap-around
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.r)   n.x = W + n.r;
        if (n.x > W + n.r) n.x = -n.r;
        if (n.y < -n.r)   n.y = H + n.r;
        if (n.y > H + n.r) n.y = -n.r;
      }

      // spawn pulses
      if (frameCount % PULSE_SPAWN_EVERY === 0) {
        spawnPulse();
      }

      // advance pulses
      pulses = pulses.filter((p) => {
        p.t += p.speed;

        // add trail point
        const nx = lerp(nodes[p.fromIdx].x, nodes[p.toIdx].x, easeInOut(p.t));
        const ny = lerp(nodes[p.fromIdx].y, nodes[p.toIdx].y, easeInOut(p.t));
        p.trail.unshift({ x: nx, y: ny, a: 0.55 });
        if (p.trail.length > TRAIL_LENGTH) p.trail.pop();

        // fade trail alphas
        for (let k = 0; k < p.trail.length; k++) {
          p.trail[k].a *= 0.88;
        }

        return p.t < 1;
      });

      draw();
      rafId = requestAnimationFrame(tick);
    }

    // ── resize handler ────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      init();
    });
    ro.observe(canvas);

    // kick off
    init();
    rafId = requestAnimationFrame(tick);

    // ── cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}
