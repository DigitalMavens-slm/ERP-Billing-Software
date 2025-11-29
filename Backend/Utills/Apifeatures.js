class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 🔍 Search by invoice number, name, or phone
  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();
      this.query = this.query.find({
        $or: [
          { invoiceNum: { $regex: keyword, $options: "i" } },
          { customerName: { $regex: keyword, $options: "i" } },
          { customerPhone: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  // 🔢 Filter by payment status
  filter() {
    if (this.queryString.status) {
      this.query = this.query.find({
        "payment.paymentStatus": this.queryString.status,
      });
    }
    return this;
  }

  // 📄 Pagination
  paginate(resPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
