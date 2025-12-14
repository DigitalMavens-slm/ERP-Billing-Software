// const Sales = require("../Model/InvoiceModel/InvoiceCreateModel");
// const Purchase = require("../Model/PurchaseModel");
// const Payment = require("../Model/PaymentModel");
// const PurchasePayment=require("../Model/PurchasePaymentModel")

// const formatDate = (date) => date.toISOString().split("T")[0];

// exports.getReports = async (req, res) => {
//   try {
//     const { from, to, type = "sales", party = "all" } = req.query;

//     const dateFilter = {};
//     if (from && to) {
//       dateFilter.date = { $gte: from, $lte: to };
//     }

//     // 🟦 KPIs (same for all types)
//     const totalSalesAgg = await Sales.aggregate([
//       { $match: dateFilter },
//       { $group: { _id: null, total: { $sum: "$subtotal" } } },
//     ]);
//     const totalSales = totalSalesAgg[0]?.total || 0;

//     const totalPurchasesAgg = await Purchase.aggregate([
//       { $match: dateFilter },
//       { $group: { _id: null, total: { $sum: "$subtotal" } } },
//     ]);
//     const totalPurchases = totalPurchasesAgg[0]?.total || 0;

//     const paymentAgg = await Payment.aggregate([
//       { $match: dateFilter },
//       { $group: { _id: "$type", total: { $sum: "$amount" } } },
//     ]);

//     let inflow = 0,
//       outflow = 0;
//     paymentAgg.forEach((p) => {
//       if (p._id === "inflow") inflow = p.total;
//       if (p._id === "outflow") outflow = p.total;
//     });
//     let netCash = inflow - outflow;

//     // 🟦 TYPE BASED RESPONSE
//     let chart = [];
//     let records = [];

//     // 🟩 SALES
//     if (type === "sales") {
//       chart = await Sales.aggregate([
//         { $match: dateFilter },
//         { $addFields: { parsedDate: { $toDate: "$date" } } },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
//             value: { $sum: "$subtotal" },
//           },
//         },
//         { $sort: { _id: 1 } },
//       ]).then((d) => d.map((x) => ({ date: x._id, value: x.value })));

//       records = await Sales.find(dateFilter)
//         .select("date reference customer subtotal")
//         .sort({ date: -1 })
//         .then((r) =>
//           r.map((x) => ({
//             _id: x._id,
//             date: formatDate(new Date(x.date)),
//             reference: x.reference,
//             party: x.customer,
//             type: "Sale",
//             amount: x.subtotal,
//           }))
//         );
//     }

//     // 🟨 PURCHASES
//     if (type === "purchases") {
//       chart = await Purchase.aggregate([
//         { $match: dateFilter },
//         { $addFields: { parsedDate: { $toDate: "$date" } } },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
//             value: { $sum: "$subtotal" },
//           },
//         },
//         { $sort: { _id: 1 } },
//       ]).then((d) => d.map((x) => ({ date: x._id, value: x.value })));

//       records = await Purchase.find(dateFilter)
//         .select("date reference vendor subtotal")
//         .sort({ date: -1 })
//         .then((r) =>
//           r.map((x) => ({
//             _id: x._id,
//             date: formatDate(new Date(x.date)),
//             reference: x.reference,
//             party: x.vendor,
//             type: "Purchase",
//             amount: x.subtotal,
//           }))
//         );
//     }



//   // 🟧 CASHFLOW (CUSTOMER + SUPPLIER)
// if (type === "cashflow") {

//   // -----------------------------
//   // 1. CUSTOMER INFLOW + OUTFLOW
//   // -----------------------------
//   const customerCash = await Payment.aggregate([
//     { $match: dateFilter },
//     {
//       $addFields: {
//         parsedDate: { $toDate: "$date" },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
//           type: "$type",
//         },
//         value: { $sum: "$amount" },
//       },
//     },
//     { $sort: { "_id.date": 1 } },
//   ]);

//   // -----------------------------
//   // 2. SUPPLIER OUTFLOW (Purchase Payment)
//   // -----------------------------
//   const supplierCash = await PurchasePayment.aggregate([
//     { $match: dateFilter },
//     {
//       $addFields: {
//         parsedDate: { $toDate: "$date" },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
//           type: "supplier_outflow",
//         },
//         value: { $sum: "$amount" },
//       },
//     },
//     { $sort: { "_id.date": 1 } },
//   ]);

//   // -----------------------------
//   // 3. MERGE BOTH (Customer + Supplier)
//   // -----------------------------
//   const combined = [...customerCash, ...supplierCash];

//   chart = combined.map((x) => ({
//     date: x._id.date,
//     type: x._id.type,
//     value: x.value,
//   }));

//   // ---------------------------------------------
//   // 4. BUILD RECORDS TABLE (Customer + Supplier)
//   // ---------------------------------------------
//   const customerRecords = await Payment.find(dateFilter)
//     .select("date reference type amount")
//     .sort({ date: -1 })
//     .then((r) =>
//       r.map((x) => ({
//         _id: x._id,
//         date: formatDate(new Date(x.date)),
//         reference: x.reference,
//         party: x.type === "inflow" ? "Customer Paid" : "Customer Refund",
//         type: x.type,
//         amount: x.amount,
//       }))
//     );

//   const supplierRecords = await PurchasePayment.find(dateFilter)
//     .select("date vendor amount")
//     .sort({ date: -1 })
//     .then((r) =>
//       r.map((x) => ({
//         _id: x._id,
//         date: formatDate(new Date(x.date)),
//         reference: "Supplier Payment",
//         party: x.vendor,
//         type: "supplier_outflow",
//         amount: x.amount,
//       }))
//     );

//   // Merge both records
//   records = [...customerRecords, ...supplierRecords];


//   let customerInflow = 0;
//   let customerOutflow = 0;
//   let supplierOutflow = 0;

//   customerCash.forEach((c) => {
//     if (c._id.type === "inflow") customerInflow += c.value;
//     if (c._id.type === "outflow") customerOutflow += c.value;
//   });

//   supplierCash.forEach((s) => {
//     supplierOutflow += s.value;
//   });

//   // Final net cashflow
//   netCash = customerInflow - (customerOutflow + supplierOutflow);
// }

//     res.json({
//       kpis: {
//         totalSales,
//         totalPurchases,
//         netCash,
//         invoices: records.length,
//       },
//       chart,
//       records,
//     });
//   } catch (err) {
//     console.error("Error in ReportsController:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


const Sales = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase = require("../Model/PurchaseModel");
const Payment = require("../Model/PaymentModel");
const PurchasePayment = require("../Model/PurchasePaymentModel");

const formatDate = (date) => date.toISOString().split("T")[0];

exports.getReports = async (req, res) => {
  try {
    const { from, to, type = "sales", party = "all" } = req.query;
    const companyId = req.companyId;

    // -----------------------------------------
    // DATE + COMPANY FILTER
    // -----------------------------------------
    const dateFilter = { companyId };

    if (from && to) {
      dateFilter.date = { $gte: from, $lte: to };
    }

    const matchFilter = { ...dateFilter };

    // -----------------------------------------
    // KPIs
    // -------------------------------------------
    const totalSalesAgg = await Sales.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

       const totalPurchasesAgg = await Purchase.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]);
    const totalPurchases = totalPurchasesAgg[0]?.total || 0;

    const paymentAgg = await Payment.aggregate([
      { $match: matchFilter },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    let inflow = 0,
      outflow = 0;

    paymentAgg.forEach((p) => {
      if (p._id === "inflow") inflow = p.total;
      if (p._id === "outflow") outflow = p.total;
    });

    let netCash = inflow - outflow;

    let chart = [];
    let records = [];

    if (type === "sales") {
      chart = await Sales.aggregate([
        { $match: matchFilter },
        { $addFields: { parsedDate: { $toDate: "$date" } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
            value: { $sum: "$subtotal" },
          },
        },
        { $sort: { _id: 1 } },
      ]).then((d) => d.map((x) => ({ date: x._id, value: x.value })));

      records = await Sales.find(matchFilter)
        .select("date reference customer subtotal")
        .sort({ date: -1 })
        .then((r) =>
          r.map((x) => ({
            _id: x._id,
            date: formatDate(new Date(x.date)),
            reference: x.reference,
            party: x.customer,
            type: "Sale",
            amount: x.subtotal,
          }))
        );
    }

    if (type === "purchases") {
      chart = await Purchase.aggregate([
        { $match: matchFilter },
        { $addFields: { parsedDate: { $toDate: "$date" } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
            value: { $sum: "$subtotal" },
          },
        },
        { $sort: { _id: 1 } },
      ]).then((d) => d.map((x) => ({ date: x._id, value: x.value })));

      records = await Purchase.find(matchFilter)
        .select("date reference vendor subtotal")
        .sort({ date: -1 })
        .then((r) =>
          r.map((x) => ({
            _id: x._id,
            date: formatDate(new Date(x.date)),
            reference: x.reference,
            party: x.vendor,
            type: "Purchase",
            amount: x.subtotal,
          }))
        );
    }

    // -----------------------------------------
    // CASHFLOW REPORT (CUSTOMER + SUPPLIER)
    // -----------------------------------------
    if (type === "cashflow") {
      // CUSTOMER CASHFLOW
      const customerCash = await Payment.aggregate([
        { $match: matchFilter },
        { $addFields: { parsedDate: { $toDate: "$date" } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
              type: "$type",
            },
            value: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      // SUPPLIER CASHFLOW
      const supplierCash = await PurchasePayment.aggregate([
        { $match: matchFilter },
        { $addFields: { parsedDate: { $toDate: "$date" } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
              type: "supplier_outflow",
            },
            value: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      const combined = [...customerCash, ...supplierCash];

      chart = combined.map((x) => ({
        date: x._id.date,
        type: x._id.type,
        value: x.value,
      }));

      // CUSTOMER TABLE RECORDS
      const customerRecords = await Payment.find(matchFilter)
        .select("date reference type amount")
        .sort({ date: -1 })
        .then((r) =>
          r.map((x) => ({
            _id: x._id,
            date: formatDate(new Date(x.date)),
            reference: x.reference,
            party: x.type === "inflow" ? "Customer Paid" : "Customer Refund",
            type: x.type,
            amount: x.amount,
          }))
        );

      // SUPPLIER TABLE RECORDS
      const supplierRecords = await PurchasePayment.find(matchFilter)
        .select("date vendor amount")
        .sort({ date: -1 })
        .then((r) =>
          r.map((x) => ({
            _id: x._id,
            date: formatDate(new Date(x.date)),
            reference: "Supplier Payment",
            party: x.vendor,
            type: "supplier_outflow",
            amount: x.amount,
          }))
        );

      records = [...customerRecords, ...supplierRecords];

      // FINAL NET CASH
      let customerInflow = 0,
        customerOutflow = 0,
        supplierOut = 0;

      customerCash.forEach((c) => {
        if (c._id.type === "inflow") customerInflow += c.value;
        if (c._id.type === "outflow") customerOutflow += c.value;
      });

      supplierCash.forEach((s) => {
        supplierOut += s.value;
      });

      netCash = customerInflow - (customerOutflow + supplierOut);
    }

    res.json({
      kpis: {
        totalSales,
        totalPurchases,
        netCash,
        invoices: records.length,
      },
      chart,
      records,
    });
  } catch (err) {
    console.error("Error in ReportsController:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

