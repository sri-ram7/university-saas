import { useState, useCallback } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchEnquiries,
  fetchStats,
  createEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  bulkDeleteEnquiries,
} from "../services/enquiries";

export const QUERY_KEYS = {
  enquiries: (filters) => [
    "enquiries",
    filters,
  ],

  stats: () => [
    "enquiries",
    "stats",
  ],
};

const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  department: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const useAdmissionEnquiries = ({
  onToast,
} = {}) => {
  const qc = useQueryClient();

  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const {
    data: listData,
    isLoading,
    isFetching,
    isError,
    error: listError,
    refetch,
  } = useQuery({
    queryKey:
      QUERY_KEYS.enquiries(filters),

    queryFn: () =>
      fetchEnquiries(filters),

    placeholderData: (prev) => prev,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.stats(),

    queryFn: fetchStats,

    staleTime: 1000 * 60 * 3,
  });

  const createMutation = useMutation({
    mutationFn: createEnquiry,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["enquiries"],
      });

      qc.invalidateQueries({
        queryKey: QUERY_KEYS.stats(),
      });

      onToast?.(
        "Enquiry submitted successfully!",
        "success"
      );
    },

    onError: (err) =>
      onToast?.(err.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      updateEnquiry(id, data),

    onMutate: async ({
      id,
      data,
    }) => {
      await qc.cancelQueries({
        queryKey: ["enquiries"],
      });

      const prev = qc.getQueryData(
        QUERY_KEYS.enquiries(filters)
      );

      if (prev?.data) {
        qc.setQueryData(
          QUERY_KEYS.enquiries(filters),
          {
            ...prev,

            data: prev.data.map((e) =>
              e._id === id
                ? {
                    ...e,
                    ...data,
                  }
                : e
            ),
          }
        );
      }

      return {
        prev,
      };
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["enquiries"],
      });

      qc.invalidateQueries({
        queryKey: QUERY_KEYS.stats(),
      });

      onToast?.(
        "Enquiry updated successfully!",
        "success"
      );
    },

    onError: (
      err,
      _,
      ctx
    ) => {
      if (ctx?.prev) {
        qc.setQueryData(
          QUERY_KEYS.enquiries(filters),
          ctx.prev
        );
      }

      onToast?.(err.message, "error");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }) =>
      updateEnquiryStatus(id, status),

    onMutate: async ({
      id,
      status,
    }) => {
      await qc.cancelQueries({
        queryKey: ["enquiries"],
      });

      const prev = qc.getQueryData(
        QUERY_KEYS.enquiries(filters)
      );

      if (prev?.data) {
        qc.setQueryData(
          QUERY_KEYS.enquiries(filters),
          {
            ...prev,

            data: prev.data.map((e) =>
              e._id === id
                ? {
                    ...e,
                    status,
                  }
                : e
            ),
          }
        );
      }

      return {
        prev,
      };
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["enquiries"],
      });

      qc.invalidateQueries({
        queryKey: QUERY_KEYS.stats(),
      });

      onToast?.(
        "Status updated.",
        "success"
      );
    },

    onError: (
      err,
      _,
      ctx
    ) => {
      if (ctx?.prev) {
        qc.setQueryData(
          QUERY_KEYS.enquiries(filters),
          ctx.prev
        );
      }

      onToast?.(err.message, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      deleteEnquiry(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["enquiries"],
      });

      qc.invalidateQueries({
        queryKey: QUERY_KEYS.stats(),
      });

      setSelectedIds([]);

      onToast?.(
        "Enquiry deleted.",
        "success"
      );
    },

    onError: (err) =>
      onToast?.(err.message, "error"),
  });

  const bulkDeleteMutation =
    useMutation({
      mutationFn: (ids) =>
        bulkDeleteEnquiries(ids),

      onSuccess: (res) => {
        qc.invalidateQueries({
          queryKey: ["enquiries"],
        });

        qc.invalidateQueries({
          queryKey: QUERY_KEYS.stats(),
        });

        setSelectedIds([]);

        onToast?.(
          res?.message ||
            "Selected enquiries deleted.",
          "success"
        );
      },

      onError: (err) =>
        onToast?.(err.message, "error"),
    });

  const updateFilters = useCallback(
    (patch) => {
      setFilters((prev) => ({
        ...prev,
        ...patch,
      }));

      setSelectedIds([]);
    },
    []
  );

  const handleSort = useCallback(
    (col) => {
      setFilters((prev) => ({
        ...prev,
        sortBy: col,
        page: 1,

        sortOrder:
          prev.sortBy === col &&
          prev.sortOrder === "asc"
            ? "desc"
            : "asc",
      }));
    },
    []
  );

  const handleCreate = useCallback(
    (data) =>
      createMutation.mutateAsync(data),
    [createMutation]
  );

  const handleUpdate = useCallback(
    (id, data) =>
      updateMutation.mutateAsync({
        id,
        data,
      }),
    [updateMutation]
  );

  const handleStatusChange =
    useCallback(
      (id, status) =>
        statusMutation.mutate({
          id,
          status,
        }),
      [statusMutation]
    );

  const handleDelete = useCallback(
    (id) =>
      deleteMutation.mutate(id),
    [deleteMutation]
  );

  const handleBulkDelete =
    useCallback(() => {
      if (selectedIds.length > 0) {
        bulkDeleteMutation.mutate(
          selectedIds
        );
      }
    }, [
      selectedIds,
      bulkDeleteMutation,
    ]);

  const handleSelectAll =
    useCallback(
      (checked) => {
        setSelectedIds(
          checked
            ? (
                listData?.data || []
              ).map((e) => e._id)
            : []
        );
      },
      [listData]
    );

  const handleSelectRow =
    useCallback((id) => {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter(
              (x) => x !== id
            )
          : [...prev, id]
      );
    }, []);

  return {
    enquiries:
      listData?.data || [],

    pagination:
      listData?.pagination || null,

    stats:
      statsData?.data || {},

    filters,

    isLoading,

    isStatsLoading,

    isFetching,

    isError,

    errorMessage:
      listError?.message || null,

    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending,

    isDeleting:
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,

    selectedIds,

    updateFilters,

    handleSort,

    handleCreate,

    handleUpdate,

    handleDelete,

    handleStatusChange,

    handleBulkDelete,

    handleSelectAll,

    handleSelectRow,

    refetch,
  };
};

export default useAdmissionEnquiries;