import { useToast } from '@react-aria/toast'
import { useRef } from 'react'
import { StyledToastContainer, ToastProps } from './Toast'
import { Text } from '@/primitives'
import { useTranslation } from 'react-i18next'
import { css } from '@/styled-system/css'
import { EmojiPortal } from '@/features/rooms/livekit/components/EmojiPortal'

export function ToastReaction({ state, ...props }: ToastProps) {
  const { t } = useTranslation('notifications')
  const ref = useRef(null)
  const { toastProps } = useToast(props, state, ref)
  const participant = props.toast.content.participant
  const emoji = props.toast.content.message ?? ''

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
      <EmojiPortal emoji={emoji} />
    </StyledToastContainer>
  )
} 