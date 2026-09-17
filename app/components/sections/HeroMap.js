'use client'
// Client component: the dot map is drawn on a canvas and reacts to the pointer.

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp } from '@/lib/motion'
import {
  UK_DOT_PITCH,
  UK_DOT_FRAME_WIDTH,
  UK_DOT_FRAME_HEIGHT,
  UK_DOT_ROWS,
} from '@/lib/ukDotMap'

/* Map pins as % of the map frame (x from left, y from top).
   Lines are drawn from the Leicester office out to each city. */
const MAP_HQ = { name: 'Leicester', x: 67, y: 75 }
const MAP_CITIES = [
  { name: 'London', x: 78, y: 84 },
  { name: 'Birmingham', x: 59, y: 77 },
  { name: 'Manchester', x: 57, y: 67 },
  { name: 'Leeds', x: 65, y: 65 },
  { name: 'Bristol', x: 49, y: 85 },
  { name: 'Cardiff', x: 42, y: 86 },
  { name: 'Glasgow', x: 36, y: 48 },
  { name: 'Edinburgh', x: 49, y: 47 },
  { name: 'Belfast', x: 23, y: 59 },
]

const ROUTE_BEND = 0.18

function buildRoutePath(city) {
  const startX = (MAP_HQ.x / 100) * UK_DOT_FRAME_WIDTH
  const startY = (MAP_HQ.y / 100) * UK_DOT_FRAME_HEIGHT
  const endX = (city.x / 100) * UK_DOT_FRAME_WIDTH
  const endY = (city.y / 100) * UK_DOT_FRAME_HEIGHT
  const controlX = (startX + endX) / 2 - (endY - startY) * ROUTE_BEND
  const controlY = (startY + endY) / 2 + (endX - startX) * ROUTE_BEND
  return `M${startX} ${startY} Q${controlX} ${controlY} ${endX} ${endY}`
}

const MAP_ROUTES = MAP_CITIES.map((city) => ({ name: city.name, path: buildRoutePath(city) }))

/* ── Dot canvas settings ─────────────────────────────────────────── */
const DOT_RADIUS = 5
const DOT_CENTRE_OFFSET = 5
/* Hovered dot plus roughly three dots in every direction */
const HOVER_RADIUS = UK_DOT_PITCH * 4.5
/* Above this intensity a dot shifts from gold towards navy (the core) */
const CORE_THRESHOLD = 0.75
/* Ring dots reach full gold by this intensity */
const GOLD_POINT = 0.35
const DOT_GROWTH = 0.35
/* Per-frame easing towards the target intensity (1 = instant) */
const FADE_SPEED = 0.18
const SETTLED_EPSILON = 0.002

const COLOUR_BASE = { red: 2, green: 20, blue: 53, alpha: 0.2 }
const COLOUR_GOLD = { red: 218, green: 162, blue: 64, alpha: 1 }
const COLOUR_NAVY = { red: 2, green: 20, blue: 53, alpha: 1 }

/* Colour set for the hero's light background: dots darken to navy at the core */
const HERO_DOT_PALETTE = { base: COLOUR_BASE, ring: COLOUR_GOLD, core: COLOUR_NAVY }

const UK_DOTS = UK_DOT_ROWS.flatMap((row, rowIndex) =>
  [...row].flatMap((cell, columnIndex) =>
    cell === '1'
      ? [{
          x: columnIndex * UK_DOT_PITCH + DOT_CENTRE_OFFSET,
          y: rowIndex * UK_DOT_PITCH + DOT_CENTRE_OFFSET,
        }]
      : []
  )
)

function mixColour(from, to, amount) {
  const channel = (key) => from[key] + (to[key] - from[key]) * amount
  return `rgba(${Math.round(channel('red'))}, ${Math.round(channel('green'))}, ${Math.round(channel('blue'))}, ${channel('alpha').toFixed(3)})`
}

function dotColour(intensity, palette) {
  if (intensity < GOLD_POINT) {
    return mixColour(palette.base, palette.ring, intensity / GOLD_POINT)
  }
  if (intensity < CORE_THRESHOLD) return mixColour(palette.ring, palette.ring, 1)
  return mixColour(palette.ring, palette.core, (intensity - CORE_THRESHOLD) / (1 - CORE_THRESHOLD))
}

/* Draws the dot map and lights up the dots around the pointer. Drawing is
   imperative (canvas + requestAnimationFrame) so 2,700+ dots never re-render React.
   `pointerTargetRef` lets the pointer be tracked on a larger element (e.g. a whole
   section) when the map itself sits behind other content. */
export function useDotMapCanvas(
  frameRef,
  canvasRef,
  shouldReduceMotion,
  { palette = HERO_DOT_PALETTE, pointerTargetRef = frameRef } = {}
) {
  useEffect(() => {
    const frame = frameRef.current
    const canvas = canvasRef.current
    const pointerTarget = pointerTargetRef.current
    if (!frame || !canvas || !pointerTarget) return
    const context = canvas.getContext('2d')
    if (!context) return

    const intensities = new Float32Array(UK_DOTS.length)
    const fadeSpeed = shouldReduceMotion ? 1 : FADE_SPEED
    let pointer = null
    let animationFrame = 0

    const draw = () => {
      const scale = canvas.width / UK_DOT_FRAME_WIDTH
      context.clearRect(0, 0, canvas.width, canvas.height)
      UK_DOTS.forEach((dot, index) => {
        const intensity = intensities[index]
        context.fillStyle = dotColour(intensity, palette)
        context.beginPath()
        context.arc(
          dot.x * scale,
          dot.y * scale,
          DOT_RADIUS * scale * (1 + intensity * DOT_GROWTH),
          0,
          Math.PI * 2
        )
        context.fill()
      })
    }

    const step = () => {
      let isSettled = true
      UK_DOTS.forEach((dot, index) => {
        const distance = pointer ? Math.hypot(dot.x - pointer.x, dot.y - pointer.y) : Infinity
        /* Soft falloff: stays strong near the pointer, fades at the edge */
        const falloff = Math.max(0, 1 - distance / HOVER_RADIUS)
        const target = 1 - (1 - falloff) ** 2
        const next = intensities[index] + (target - intensities[index]) * fadeSpeed
        const isClose = Math.abs(next - target) < SETTLED_EPSILON
        intensities[index] = isClose ? target : next
        if (!isClose) isSettled = false
      })
      draw()
      animationFrame = isSettled ? 0 : requestAnimationFrame(step)
    }

    const startAnimation = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(step)
    }

    const handlePointerMove = (event) => {
      const bounds = frame.getBoundingClientRect()
      pointer = {
        x: ((event.clientX - bounds.left) / bounds.width) * UK_DOT_FRAME_WIDTH,
        y: ((event.clientY - bounds.top) / bounds.height) * UK_DOT_FRAME_HEIGHT,
      }
      startAnimation()
    }

    const handlePointerLeave = () => {
      pointer = null
      startAnimation()
    }

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = Math.round(frame.clientWidth * pixelRatio)
      canvas.height = Math.round(frame.clientHeight * pixelRatio)
      draw()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    pointerTarget.addEventListener('pointermove', handlePointerMove)
    pointerTarget.addEventListener('pointerdown', handlePointerMove)
    pointerTarget.addEventListener('pointerleave', handlePointerLeave)
    pointerTarget.addEventListener('pointercancel', handlePointerLeave)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
      pointerTarget.removeEventListener('pointermove', handlePointerMove)
      pointerTarget.removeEventListener('pointerdown', handlePointerMove)
      pointerTarget.removeEventListener('pointerleave', handlePointerLeave)
      pointerTarget.removeEventListener('pointercancel', handlePointerLeave)
    }
  }, [frameRef, canvasRef, shouldReduceMotion, palette, pointerTargetRef])
}

export function HeroMap({ motionStyle }) {
  const frameRef = useRef(null)
  const canvasRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const hqStyle = { left: `${MAP_HQ.x}%`, top: `${MAP_HQ.y}%` }

  useDotMapCanvas(frameRef, canvasRef, shouldReduceMotion)

  return (
    <motion.div
      className="hero-visual"
      aria-hidden="true"
      variants={fadeUp}
      custom={2}
      initial="hidden"
      animate="visible"
    >
      <motion.div ref={frameRef} className="hero-map" style={motionStyle}>
        <canvas ref={canvasRef} className="hero-map__canvas" />

        <svg className="hero-map__routes" viewBox={`0 0 ${UK_DOT_FRAME_WIDTH} ${UK_DOT_FRAME_HEIGHT}`}>
          {MAP_ROUTES.map((route) => (
            <path key={route.name} className="hero-map__route" d={route.path} />
          ))}
        </svg>

        {MAP_CITIES.map((city) => (
          <HeroMapPin key={city.name} city={city} />
        ))}
        <span className="hero-map__pin hero-map__pin--hq" style={hqStyle} />
        <span className="label hero-map__hq-label" style={hqStyle}>Leicester Based</span>

        <div className="hero-chip hero-chip--top">
          <span className="label hero-chip__title">7 Funding Routes</span>
          <span className="hero-chip__caption">Property, business &amp; asset</span>
        </div>

        <div className="hero-chip hero-chip--bottom">
          <span className="label hero-chip__title">UK-Wide Lender Panel</span>
          <span className="hero-chip__caption">Banks, challengers &amp; private funders</span>
        </div>
      </motion.div>

      <style>{`
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 0;
          padding-right: clamp(0px, 7vw, 120px);
        }

        .hero-map {
          position: relative;
          height: clamp(320px, calc(100svh - var(--hero-nav-h) - var(--hero-bar-h) - var(--hero-ledge-h) - 72px), 680px);
          aspect-ratio: ${UK_DOT_FRAME_WIDTH} / ${UK_DOT_FRAME_HEIGHT};
          touch-action: pan-y;
        }

        .hero-map__canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-map__routes {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .hero-map__route {
          fill: none;
          stroke: var(--gold);
          stroke-width: 1.2;
          stroke-dasharray: 3 5;
          opacity: 0.75;
          vector-effect: non-scaling-stroke;
          animation: heroRouteFlow 3s linear infinite;
        }

        @keyframes heroRouteFlow {
          to { stroke-dashoffset: -32; }
        }

        .hero-map__pin {
          position: absolute;
          width: 7px;
          height: 7px;
          margin: -3.5px 0 0 -3.5px;
          border-radius: 50%;
          background: var(--navy);
          box-shadow: 0 0 0 3px #ffffff;
          pointer-events: none;
        }

        .hero-map__pin--hq {
          width: 12px;
          height: 12px;
          margin: -6px 0 0 -6px;
          background: var(--gold);
          animation: heroMarkerPulse 2.6s ease-out infinite;
        }

        @keyframes heroMarkerPulse {
          0%   { box-shadow: 0 0 0 3px #ffffff, 0 0 0 3px rgba(218, 162, 64, 0.55); }
          70%  { box-shadow: 0 0 0 3px #ffffff, 0 0 0 20px rgba(218, 162, 64, 0); }
          100% { box-shadow: 0 0 0 3px #ffffff, 0 0 0 3px rgba(218, 162, 64, 0); }
        }

        .hero-map__hq-label {
          position: absolute;
          transform: translate(14px, -50%);
          padding: 5px 10px;
          background: var(--navy);
          color: #ffffff;
          white-space: nowrap;
          pointer-events: none;
        }

        /* Floating glass cards, in the open water west of the map */
        .hero-chip {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 12px 16px;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.86);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          border: 1px solid var(--gold-border);
          box-shadow: 0 18px 40px -18px rgba(2, 20, 53, 0.28);
          pointer-events: none;
          animation: heroChipFloat 6s ease-in-out infinite;
        }

        .hero-chip--top {
          top: 18%;
          right: 72%;
        }

        .hero-chip--bottom {
          bottom: 14%;
          right: 92%;
          animation-delay: -3s;
        }

        @keyframes heroChipFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .hero-chip__title {
          color: var(--navy);
        }

        .hero-chip__caption {
          font-family: var(--next-font-roboto), system-ui, sans-serif;
          font-size: 12px;
          color: rgba(2, 20, 53, 0.55);
        }

        /* ── Responsive ─────────────────────────────────────────────── */
        /* Cards need the gap between text and map; drop them when it closes */
        @media (max-width: 1199px) {
          .hero-chip {
            display: none;
          }
        }

        /* Tablet and phone: faint, centred backdrop behind the text */
        @media (max-width: 1023px) {
          .hero-visual {
            position: absolute;
            inset: 0;
            z-index: 0;
            justify-content: center;
            padding-right: 0;
            opacity: 0.55;
            pointer-events: none;
          }

          .hero-map {
            height: 100%;
            max-height: 640px;
          }

          .hero-map__routes,
          .hero-map__pin,
          .hero-map__hq-label {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-map__pin--hq,
          .hero-map__route,
          .hero-chip {
            animation: none;
          }
        }
      `}</style>
    </motion.div>
  )
}

function HeroMapPin({ city }) {
  const pinStyle = { left: `${city.x}%`, top: `${city.y}%` }
  return <span className="hero-map__pin" style={pinStyle} />
}
