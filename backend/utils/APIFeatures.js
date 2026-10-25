const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields) {
    if (this.queryString.search) {
      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: {
            $regex: this.queryString.search,
            $options: "i",
          },
        })),
      });   
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = [
      "search",
      "page",
      "limit",
      "sort",
    ];

    excludedFields.forEach((field) => delete queryObj[field]);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = Math.max(1, Number.parseInt(this.queryString.page, 10) || 1);
    const requestedLimit =
      Number.parseInt(this.queryString.limit, 10) || DEFAULT_PAGE_SIZE;
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, requestedLimit));

    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }

  paginateIfRequested() {
    const hasPagination =
      Object.prototype.hasOwnProperty.call(this.queryString, "page") ||
      Object.prototype.hasOwnProperty.call(this.queryString, "limit");

    if (hasPagination) {
      this.paginate();
    }

    return this;
  }
}

module.exports = APIFeatures;