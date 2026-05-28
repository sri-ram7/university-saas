import axiosInstance from "./axiosInstance";

export const fetchEnquiries = async (
  params = {}
) => {
  const res =
    await axiosInstance.get(
      "/enquiries",
      {
        params,
      }
    );

  return res.data;
};

export const fetchEnquiry = async (
  id
) => {
  const res =
    await axiosInstance.get(
      `/enquiries/${id}`
    );

  return res.data;
};

export const createEnquiry = async (
  body
) => {
  const res =
    await axiosInstance.post(
      "/enquiries",
      body
    );

  return res.data;
};

export const updateEnquiry = async (
  id,
  body
) => {
  const res =
    await axiosInstance.patch(
      `/enquiries/${id}`,
      body
    );

  return res.data;
};

export const updateEnquiryStatus =
  async (id, status) => {
    const res =
      await axiosInstance.patch(
        `/enquiries/${id}/status`,
        {
          status,
        }
      );

    return res.data;
  };

export const deleteEnquiry =
  async (id) => {
    const res =
      await axiosInstance.delete(
        `/enquiries/${id}`
      );

    return res.data;
  };

export const bulkDeleteEnquiries =
  async (ids) => {
    const res =
      await axiosInstance.delete(
        "/enquiries/bulk",
        {
          data: {
            ids,
          },
        }
      );

    return res.data;
  };

export const fetchStats =
  async () => {
    const res =
      await axiosInstance.get(
        "/enquiries/stats"
      );

    return res.data;
  };