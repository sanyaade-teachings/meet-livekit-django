import { useTranslation } from 'react-i18next'
import { RiEmotionLine } from '@remixicon/react'
import { useState, useRef, useEffect } from 'react'
import { css } from '@/styled-system/css'
import { useRoomContext } from '@livekit/components-react'
import { ToggleButton } from '@/primitives'
import { NotificationType } from '@/features/notifications/NotificationType'
import { NotificationPayload } from '@/features/notifications/NotificationPayload'

const EMOJIS = ['👍', '👎', '👏', '❤️', '😂', '😮', '🎉']

export const ReactionsButton = () => {
  const { t } = useTranslation('rooms', { keyPrefix: 'controls.reactions' })
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const room = useRoomContext()

  const sendReaction = async (emoji: string) => {
    const encoder = new TextEncoder()
    const payload: NotificationPayload = {
      type: NotificationType.ReactionReceived,
      data: {
        emoji: emoji,
      }
    }
    const data = encoder.encode(JSON.stringify(payload))
    await room.localParticipant.publishData(data, { reliable: true })
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={css({ position: 'relative' })}>
      <ToggleButton
        square
        variant="primaryDark"
        aria-label={t('button')}
        tooltip={t('button')}
        isSelected={isOpen}
        onPress={() => setIsOpen(!isOpen)}
      >
        <RiEmotionLine />
      </ToggleButton>

      {isOpen && (
        <div
          className={css({
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '0.5rem',
            backgroundColor: 'gray.800',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            boxShadow: 'dark-lg',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 50,
          })}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={css({
                fontSize: '1.5rem',
                padding: '0.25rem',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                borderRadius: '0.25rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'gray.700'
                }
              })}
              onClick={() => sendReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}