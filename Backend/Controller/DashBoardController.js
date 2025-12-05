const Invoice=require("../Model/InvoiceModel/InvoiceCreateModel")

const getDashboardData = async (req, res) => {
  try {
    // console.log(req.companyId)
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const lastMonth = thisMonth - 1 === 0 ? 12 : thisMonth - 1;
    const thisYear = today.getFullYear();
    const lastMonthYear = lastMonth === 12 ? thisYear - 1 : thisYear;

    // 1) FETCH ALL invoices (small data)
    const invoices = await Invoice.find({companyId:req.companyId});

    // 2) TOTAL REVENUE
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);

    // 3) THIS MONTH REVENUE
    const thisMonthRevenue = invoices
      .filter(inv => {
        const d = new Date(inv.date);
        return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, inv) => sum + inv.subtotal, 0);

    // 4) LAST MONTH REVENUE
    const lastMonthRevenue = invoices
      .filter(inv => {
        const d = new Date(inv.date);
        return d.getMonth() + 1 === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum, inv) => sum + inv.subtotal, 0);

    // 5) REVENUE GROWTH %
    const growth =
      lastMonthRevenue === 0
        ? 100
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // 6) OUTSTANDING (pending amount)
    const pendingInvoices = invoices.filter(
      inv => inv.paymentStatus !== "Paid"
    );
    const outstandingAmount = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.subtotal - inv.paidAmount),
      0
    );

    // 7) OVERDUE 
    const overdueInvoices = invoices.filter(inv => {
      const due = new Date(inv.dueDate);
      return due < today && inv.paymentStatus !== "Paid";
    });
    const overdueAmount = overdueInvoices.reduce(
      (sum, inv) => sum + (inv.subtotal - inv.paidAmount),
      0
    );

    res.status(200).json({
      success: true,
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      growth: growth.toFixed(2), // 12.5%
      outstandingAmount,
      pendingCount: pendingInvoices.length,
      overdueAmount,
      overdueCount: overdueInvoices.length,
      invoices,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports=getDashboardData
