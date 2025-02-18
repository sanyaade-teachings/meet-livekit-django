import { useToast } from '@react-aria/toast'
import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { StyledToastContainer, ToastProps } from './Toast'
import { Text } from '@/primitives'
import { useTranslation } from 'react-i18next'
import { css } from '@/styled-system/css'

// Subcomponent for a single floating emoji with a delay
function FloatingEmoji({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  const [deltaY, setDeltaY] = useState(0)
  const [opacity, setOpacity] = useState(0)
  // Determine a random starting position on the screen
  const [left] = useState(() => Math.random() * window.innerWidth)
  const [startTop] = useState(() => Math.random() * window.innerHeight)

  useEffect(() => {
    let start: number | null = null
    const duration = 3000 // animation duration in milliseconds

    function animate(timestamp: number) {
      if (start === null) start = timestamp
      const elapsed = timestamp - start - delay
      if (elapsed < 0) {
        setOpacity(0)
      } else {
        const progress = Math.min(elapsed / duration, 1)
        setDeltaY(-50 * progress) // float upward by 50px over the duration
        setOpacity(1 - progress)   // fade from 1 to 0
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
        fontSize: '3rem', // larger emoji size
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

export function ToastReaction({ state, ...props }: ToastProps) {
  const { t } = useTranslation('notifications')
  const ref = useRef(null)
  const { toastProps } = useToast(props, state, ref)
  const participant = props.toast.content.participant
  const emoji = props.toast.content.message ?? ''

  // Spawn five floating emojis with incremental delays
  const emojiCount = 5
  const delays = Array.from({ length: emojiCount }, (_, i) => i * 100)

  // Define a full-screen fixed container for the emojis
  const emojiPortal = (
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
    </div>
  )

  return (
    <StyledToastContainer {...toastProps} ref={ref}>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            padding: '14px',
            gap: '0.75rem',
            textAlign: 'start',
            width: '150px',
            md: {
              width: '260px',
            },
          })}
        >
        <Text margin={false} wrap="pretty" centered={false}>
          {t('reaction.description', {
            name: participant.name || t('defaultName'),
            emoji: emoji,
          })}
        </Text>
      </div>
      {createPortal(emojiPortal, document.body)}
    </StyledToastContainer>
  )
} 