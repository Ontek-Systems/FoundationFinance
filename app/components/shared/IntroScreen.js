'use client'
// Client component: the intro timeline, session check and scroll lock all need the browser.

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { EASE_SMOOTH } from '@/lib/motion'

const LOGO_SRC = '/assets/images/logo.png'
const LOGO_MASK_URL = `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${LOGO_SRC})`
const LOGO_SIZE = 1254
const EXIT_AT_MS = 3300
const GOLD_GLOW = 'rgba(218, 162, 64'

/* Base bars, as pixel boxes within the logo image; they open from the centre */
const BARS = [
  { box: { left: 419, top: 634, right: 848, bottom: 654 }, delay: 0.3 },
  { box: { left: 455, top: 605.5, right: 814, bottom: 623 }, delay: 0.45 },
]
const BAR_CENTRE_X = 634

/* Building outlines within the logo, cut off at the top bar so each one rises
   out of it. Shaped to keep the middle tower's upper step out of the left slice. */
const BUILDINGS = [
  [[495, 606], [495, 436], [560, 396], [590, 390], [590, 606]],
  [[558, 606], [558, 320], [680, 250], [671, 606]],
  [[671, 606], [671, 380], [770, 380], [770, 606]],
]
const BUILDING_RISE_DELAY = 0.8
const BUILDING_STAGGER = 0.12

/* Wordmark pieces, as pixel boxes within the logo image */
const FOUNDATION_BOX = { left: 105, top: 698, right: 1153, bottom: 816 }
const FINANCE_BOX = { left: 349, top: 854, right: 895, bottom: 925 }
const LEFT_LINE_BOX = { left: 109, top: 878, right: 308, bottom: 892 }
const RIGHT_LINE_BOX = { left: 941, top: 878, right: 1142, bottom: 892 }

function clipToBox({ left, top, right, bottom }) {
  const percent = (value) => `${(value / LOGO_SIZE) * 100}%`
  return `inset(${percent(top)} ${percent(LOGO_SIZE - right)} ${percent(LOGO_SIZE - bottom)} ${percent(left)})`
}

function clipToPolygon(points) {
  const percent = (value) => `${(value / LOGO_SIZE) * 100}%`
  return `polygon(${points.map(([x, y]) => `${percent(x)} ${percent(y)}`).join(', ')})`
}

const FOUNDATION_CLIP = { clipPath: clipToBox(FOUNDATION_BOX) }
const FINANCE_CLIP = { clipPath: clipToBox(FINANCE_BOX) }

/* Lines grow outward from the end nearest the word */
const LEFT_LINE_HIDDEN = { clipPath: clipToBox({ ...LEFT_LINE_BOX, left: LEFT_LINE_BOX.right }) }
const LEFT_LINE_SHOWN = { clipPath: clipToBox(LEFT_LINE_BOX) }
const RIGHT_LINE_HIDDEN = { clipPath: clipToBox({ ...RIGHT_LINE_BOX, right: RIGHT_LINE_BOX.left }) }
const RIGHT_LINE_SHOWN = { clipPath: clipToBox(RIGHT_LINE_BOX) }

const WORD_HIDDEN = { opacity: 0, y: 14 }
const WORD_SHOWN = { opacity: 1, y: 0 }

const BAR_OPEN = { duration: 0.6, ease: EASE_SMOOTH }
const BUILDING_RISE = { duration: 0.9, ease: EASE_SMOOTH }
const GLOW_PULSE = { duration: 1.4, delay: 1.75, ease: 'easeInOut', times: [0, 0.35, 1] }
const FOUNDATION_IN = { duration: 0.6, delay: 1.8, ease: EASE_SMOOTH }
const LINES_IN = { duration: 0.6, delay: 2.0, ease: EASE_SMOOTH }
const FINANCE_IN = { duration: 0.6, delay: 2.1, ease: EASE_SMOOTH }
const SHIMMER_SWEEP = { duration: 0.9, delay: 2.5, ease: 'easeInOut' }
const EXIT_TRANSITION = { duration: 0.9, ease: [0.76, 0, 0.24, 1] }

const GLOW_KEYFRAMES = [
  `drop-shadow(0 0 0px ${GOLD_GLOW}, 0))`,
  `drop-shadow(0 0 26px ${GOLD_GLOW}, 0.75))`,
  `drop-shadow(0 0 8px ${GOLD_GLOW}, 0.2))`,
]

const SHIMMER_MASK = {
  maskImage: LOGO_MASK_URL,
  WebkitMaskImage: LOGO_MASK_URL,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
}

export function IntroScreen() {
  const [phase, setPhase] = useState('playing')

  useEffect(() => {
    /* Returning visitors: the pre-paint script already hid this via CSS */
    if ('introSeen' in document.documentElement.dataset) return
    const exitTimer = setTimeout(() => setPhase('exiting'), EXIT_AT_MS)
    return () => clearTimeout(exitTimer)
  }, [])

  function handleExitComplete() {
    if (phase !== 'exiting') return
    document.documentElement.dataset.introSeen = ''
    setPhase('done')
  }

  if (phase === 'done') return null

  const isExiting = phase === 'exiting'

  return (
    <motion.div
      id="intro-screen"
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--navy)]"
      initial={false}
      animate={isExiting ? { y: '-100%' } : { y: '0%' }}
      transition={EXIT_TRANSITION}
      onAnimationComplete={handleExitComplete}
    >
      <motion.div
        className="relative aspect-square w-[min(80vw,440px)]"
        animate={isExiting ? { scale: 0.92, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={EXIT_TRANSITION}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ filter: GLOW_KEYFRAMES[0] }}
          animate={{ filter: GLOW_KEYFRAMES }}
          transition={GLOW_PULSE}
        >
          <BuildingMark />
        </motion.div>

        <motion.div className="absolute inset-0" initial={WORD_HIDDEN} animate={WORD_SHOWN} transition={FOUNDATION_IN}>
          <LogoSlice clip={FOUNDATION_CLIP} />
        </motion.div>

        <motion.div className="absolute inset-0" initial={LEFT_LINE_HIDDEN} animate={LEFT_LINE_SHOWN} transition={LINES_IN}>
          <LogoSlice />
        </motion.div>

        <motion.div className="absolute inset-0" initial={RIGHT_LINE_HIDDEN} animate={RIGHT_LINE_SHOWN} transition={LINES_IN}>
          <LogoSlice />
        </motion.div>

        <motion.div className="absolute inset-0" initial={WORD_HIDDEN} animate={WORD_SHOWN} transition={FINANCE_IN}>
          <LogoSlice clip={FINANCE_CLIP} />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden" style={SHIMMER_MASK}>
          <motion.div
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            initial={{ x: '-150%' }}
            animate={{ x: '400%' }}
            transition={SHIMMER_SWEEP}
          />
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
    </motion.div>
  )
}

function LogoSlice({ clip }) {
  return (
    <div className="absolute inset-0" style={clip}>
      <Image src={LOGO_SRC} alt="" fill sizes="440px" priority className="object-contain" />
    </div>
  )
}

/* Base bars slide open, then each building rises up out of the top bar */
function BuildingMark() {
  return (
    <>
      {BARS.map((bar) => (
        <motion.div
          key={bar.box.top}
          className="absolute inset-0"
          initial={{ clipPath: clipToBox({ ...bar.box, left: BAR_CENTRE_X, right: BAR_CENTRE_X }) }}
          animate={{ clipPath: clipToBox(bar.box) }}
          transition={{ ...BAR_OPEN, delay: bar.delay }}
        >
          <LogoSlice />
        </motion.div>
      ))}

      {BUILDINGS.map((outline, index) => (
        <div key={outline[1].join()} className="absolute inset-0" style={{ clipPath: clipToPolygon(outline) }}>
          <motion.div
            className="absolute inset-0"
            initial={{ y: '30%' }}
            animate={{ y: '0%' }}
            transition={{ ...BUILDING_RISE, delay: BUILDING_RISE_DELAY + index * BUILDING_STAGGER }}
          >
            <LogoSlice />
          </motion.div>
        </div>
      ))}
    </>
  )
}
