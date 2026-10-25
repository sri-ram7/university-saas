import { useState } from 'react'
import { FiCheckCircle, FiExternalLink } from 'react-icons/fi'
import PageHeader from '@/components/common/PageHeader'
import { Card, FileUpload, Button, Alert } from '@/components/ui'
import { useUploadFile } from '../hooks/useUpload'

export default function UploadsPage() {
  const [file, setFile] = useState(null)
  const [history, setHistory] = useState([])
  const uploadMutation = useUploadFile()

  const handleUpload = () => {
    if (!file) return
    uploadMutation.mutate(file, {
      onSuccess: (res) => {
        setHistory((prev) => [{ name: file.name, ...res.data }, ...prev])
        setFile(null)
      },
    })
  }

  return (
    <div>
      <PageHeader title="Uploads" description="Upload a file to storage." />

      <Card className="max-w-xl">
        <FileUpload
          label="File"
          file={file}
          onFileSelect={setFile}
          onClear={() => setFile(null)}
          hint="Drag & drop a file here, or click to browse"
        />
        <Button className="mt-4" onClick={handleUpload} isLoading={uploadMutation.isPending} disabled={!file}>
          Upload
        </Button>

        <Alert tone="info" className="mt-4">
          There&apos;s no endpoint to list previously uploaded files — this
          page only shows files uploaded during the current session.
        </Alert>
      </Card>

      {history.length > 0 && (
        <Card className="mt-4 max-w-xl">
          <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Uploaded this session
          </p>
          <ul className="space-y-2">
            {history.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-ink-800">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <FiCheckCircle className="text-emerald-500" size={15} />
                  {item.name}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-brand-600 hover:text-brand-700"
                  >
                    View <FiExternalLink size={13} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
