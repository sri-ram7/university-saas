import { useState } from 'react'

/** Server-side pagination state: page + pageSize, reset page on pageSize change. */
export function usePagination(initialPageSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const setPageSize = (size) => {
    setPageSizeState(size)
    setPage(1)
  }

  return { page, setPage, pageSize, setPageSize }
}
