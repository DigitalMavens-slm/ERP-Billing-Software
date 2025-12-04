const express=require("express")
const router=express.Router()
const Purchase=require("./Model/PurchaseModel")
const auth=require("./Middlewares/auth")
const companyCheck=require("./Middlewares/companyCheck")



router.get("/purchases/next-bill-num", auth, companyCheck, async (req, res) => {

  console.log("companyId:", req.companyId);

  try {
    const lastPurchase = await Purchase.findOne({ companyId: req.companyId }).sort({ createdAt: -1 });

    let nextBillNum = "BILL0001";

    if (lastPurchase && lastPurchase.billNum) {
      const num = parseInt(lastPurchase.billNum.replace("BILL", ""), 10) + 1;
      nextBillNum = `BILL${String(num).padStart(4, "0")}`;
      console.log("Bill Num",nextBillNum);
    }

    res.json({ nextBillNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bill number" });
  }
});

module.exports = router;

