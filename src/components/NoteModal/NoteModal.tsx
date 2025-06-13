import { useEffect } from 'react'
import NoteForm from '../NoteForm/NoteForm'
import css from './NoteModal.module.css'
import { createPortal } from 'react-dom'

export interface NoteModalProps {
  onClose: () => void
}

export default function NoteModal({ onClose }: NoteModalProps) {
 const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  if (event.target === event.currentTarget) {
    onClose()
  }
 }

 useEffect(() => {
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }
  document.addEventListener('keydown', handleEscKey)
  return () => {
    document.removeEventListener('keydown', handleEscKey)
  }
 }, [onClose])

  return createPortal(<div
  className={css.backdrop}
  onClick={handleBackDropClick}
  role="dialog"
  aria-modal="true"
>
  <div className={css.modal}>
    <NoteForm onCancel={onClose}/>
  </div>
</div>, document.body)
}