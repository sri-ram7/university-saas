 

const { AdmissionEnquiry } = require("../models/AdmissionEnquiry");
const { ApiError } = require("../middleware/error.middleware");

async function paginatedQuery(filter, { page, limit, sortBy, sortOrder }) {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [data, total] = await Promise.all([
    AdmissionEnquiry.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    AdmissionEnquiry.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
}


const listEnquiries = async (req, res, next) => {
  try {
    const { page, limit, search, status, department, sortBy, sortOrder } = req.query;
    const filter = AdmissionEnquiry.buildFilter({ search, status, department });
    const result = await paginatedQuery(filter, { page, limit, sortBy, sortOrder });

    res.json({
      success: true,
      message: "Enquiries retrieved successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};


const createEnquiry = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.create(req.body);
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};


const getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.findById(req.params.id).lean();
    if (!enquiry) throw new ApiError("Enquiry not found", 404);
    res.json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};


const updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) throw new ApiError("Enquiry not found", 404);

    res.json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};


const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) throw new ApiError("Enquiry not found", 404);

    res.json({
      success: true,
      message: `Status updated to "${status}"`,
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};


const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) throw new ApiError("Enquiry not found", 404);
    res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err) {
    next(err);
  }
};


const bulkDeleteEnquiries = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ApiError("ids must be a non-empty array", 400);
    }
    const result = await AdmissionEnquiry.deleteMany({ _id: { $in: ids } });
    res.json({
      success: true,
      message: `${result.deletedCount} enquir${result.deletedCount === 1 ? "y" : "ies"} deleted`,
    });
  } catch (err) {
    next(err);
  }
};


const getStats = async (req, res, next) => {
  try {
    const [totals, departmentBreakdown] = await Promise.all([
      AdmissionEnquiry.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      AdmissionEnquiry.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const statusMap = { pending: 0, contacted: 0, admitted: 0, rejected: 0 };
    let total = 0;
    totals.forEach(({ _id, count }) => {
      if (_id) {
        statusMap[_id.toLowerCase()] = count;
      }
      total += count;
    });

    res.json({
      success: true,
      data: {
        total,
        ...statusMap,
        departmentBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listEnquiries,
  createEnquiry,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  bulkDeleteEnquiries,
  getStats,
};
