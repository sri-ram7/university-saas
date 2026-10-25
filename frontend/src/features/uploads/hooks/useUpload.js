import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { uploadFile } from '../services/uploadService'

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => toast.success('File uploaded'),
  })
}
