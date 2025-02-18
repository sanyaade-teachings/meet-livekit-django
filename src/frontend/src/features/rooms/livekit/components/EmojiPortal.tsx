import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import { css } from '@/styled-system/css'

interface FloatingEmojiProps {
  emoji: string
  delay?: number
}

export function FloatingEmoji({ emoji, delay = 0 }: FloatingEmojiProps) {
  const [deltaY, setDeltaY] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const [left] = useState(() => Math.random() * window.innerWidth)
  const [startTop] = useState(() => Math.random() * window.innerHeight)

  useEffect(() => {
    let start: number | null = null
    const duration = 3000

    function animate(timestamp: number) {
      if (start === null) start = timestamp
      const elapsed = timestamp - start - delay
      if (elapsed < 0) {
        setOpacity(0)
      } else {
        const progress = Math.min(elapsed / duration, 1)
        setDeltaY(-50 * progress)
        setOpacity(1 - progress)
      }
      if (elapsed < duration) {
        requestAnimationFrame(animate)
      }
    }
    const req = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(req)
  }, [delay])

  return (
    <span
      className={css({
        fontSize: '3rem',
        position: 'absolute',
        display: 'inline-block',
      })}
      style={{
        transform: `translate(${left}px, ${startTop + deltaY}px)`,
        opacity: opacity,
      }}
    >
      {emoji}
    </span>
  )
}

export function EmojiPortal({ emoji }: { emoji: string }) {
  const emojiCount = 5
  const delays = Array.from({ length: emojiCount }, (_, i) => i * 100)

  return createPortal(
    <div
      className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      })}
    >
      {delays.map((delay, index) => (
        <FloatingEmoji key={index} emoji={emoji} delay={delay} />
      ))}
    </div>,
    document.body
  )
}