class BaseApiFeatures {
  constructor(query, queryString) {
    this.query = query;                       //mongoose quey   find call in purchase controller
    this.queryString = queryString;           //   req.query string
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}


module.exports = BaseApiFeatures;


