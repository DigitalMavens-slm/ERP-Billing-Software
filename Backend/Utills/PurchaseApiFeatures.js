const BaseAPIFeatures = require("./BaseApiFeatures");

class PurchaseAPIFeatures extends BaseAPIFeatures {
  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();

      this.query = this.query.find({
        $or: [
          { purchaseNum: { $regex: keyword, $options: "i" } },
          { supplierName: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  filter() {
    if (this.queryString.status) {
      this.query = this.query.find({
        "payment.paymentStatus": this.queryString.status,
      });
    }
    return this;
  }
}

module.exports = PurchaseAPIFeatures;
