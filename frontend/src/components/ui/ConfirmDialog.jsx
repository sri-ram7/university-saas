import Modal from './Modal'
import Button from './Button'

/**
 * Generic confirm dialog for destructive/irreversible actions (delete,
 * bulk delete, etc). Controlled entirely by props — no internal state.
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={tone} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
