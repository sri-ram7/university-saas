import { useCallback, useState } from 'react'

/** Common open/close boolean state pattern for modals and dialogs. */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((o) => !o), [])
  return { isOpen, open, close, toggle }
}
