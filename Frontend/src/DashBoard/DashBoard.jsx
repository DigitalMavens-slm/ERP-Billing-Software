import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  TrendingUp,
  Wallet,
  Clock,
  FilePlus,
  UserPlus,
  PackagePlus,
  BarChart3,
  Eye, Printer, Plus
} from "lucide-react";
                 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

// const API_URL = import.meta.env.VITE_API_URL;
import api from "../api"

export default function DashBoard() {
  const navigate = useNavigate();

  const [InvoiceCount, setInvoiceCount] = useState([]);
    const [salesTrendData, setSalesTrendData] = useState([]);
  const [statusPieData, setStatusPieData] = useState([]);

  const [kpi, setKpi] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    growth: 0,
    outstandingAmount: 0,
    pendingCount: 0,
    overdueAmount: 0,
    overdueCount: 0,
  });


  const invoicefetcher = async () => {
    const res = await api.get(`/api/allinvoice`);
    setInvoiceCount(res.data.invoices);
  };

  const getDashboardKPI = async () => {
    const res = await api.get(`/api/dashboardkpi`);
    // console.log(res.data)
    setKpi(res.data);
  };

  useEffect(() => {
    invoicefetcher();
    getDashboardKPI();
  }, []);


    /* ---- BUILD GRAPHS ---- */
  useEffect(() => {
    if (InvoiceCount.length > 0) {
      buildSalesTrend();
      buildStatusPie();
    }
  }, [InvoiceCount]);

  const buildSalesTrend = () => {
    const monthly = {};

    InvoiceCount.forEach((inv) => {
      const date = new Date(inv.date);
      const month = date.toLocaleString("en-US", { month: "short" });

      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += inv.subtotal;
    });

    const finalData = Object.keys(monthly).map((m) => ({
      month: m,
      sales: monthly[m],
    }));

    setSalesTrendData(finalData);
  };

  const buildStatusPie = () => {
    const paid = InvoiceCount.filter((i) => i.paymentStatus === "Paid").length;
    const pending = InvoiceCount.filter(
      (i) => i.paymentStatus === "Pending"
    ).length;
    const overdue = InvoiceCount.filter(
      (i) => i.paymentStatus === "Overdue"
    ).length;

    setStatusPieData([
      { name: "Paid", value: paid },
      { name: "Pending", value: pending },
      { name: "Overdue", value: overdue },
    ]);
  };





  return (
    <div className="w-full p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

  {/* TOTAL REVENUE */}
  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md border-l-4 border-blue-500 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-medium text-gray-600">TOTAL REVENUE</p>
      <FileText size={26} className="text-blue-500" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">
      ₹{(kpi.totalRevenue ?? 0).toLocaleString()}
    </h2>
    <div className="mt-2 h-5 overflow-hidden relative">
      {/* <p className="text-xs text-green-600 font-semibold animate-scrollText">
        {kpi.growth}% from last month
      </p> */}
      <p className="text-xs text-green-600 font-semibold animate-scrollText delay-0">
  {kpi.growth}% from last month
</p>

    </div>
  </div>

  {/* OUTSTANDING */}
  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md border-l-4 border-yellow-500 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-medium text-gray-600">OUTSTANDING</p>
      <TrendingUp size={26} className="text-yellow-500" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">
      ₹{(kpi.outstandingAmount ?? 0).toLocaleString()}
    </h2>
    <div className="mt-2 h-5 overflow-hidden relative">
      {/* <p className="text-xs text-gray-600 font-semibold animate-scrollText">
        {kpi.pendingCount} invoices pending
      </p> */}
      <p className="text-xs text-gray-600 font-semibold animate-scrollText delay-1">
  {kpi.pendingCount} invoices pending
</p>

    </div>
  </div>

  {/* OVERDUE */}
  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md border-l-4 border-red-500 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-medium text-gray-600">OVERDUE</p>
      <Clock size={26} className="text-red-500" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">
      ₹{(kpi.overdueAmount ?? 0).toLocaleString()}
    </h2>
    <div className="mt-2 h-5 overflow-hidden relative">
      {/* <p className="text-xs text-red-600 font-semibold animate-scrollText">
        {kpi.overdueCount} overdue invoices
      </p> */}
      <p className="text-xs text-red-600 font-semibold animate-scrollText delay-2">
  {kpi.overdueCount} overdue invoices
</p>

    </div>
  </div>

  {/* TOTAL INVOICES */}
  <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md border-l-4 border-green-500 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm font-medium text-gray-600">TOTAL INVOICES</p>
      <Wallet size={26} className="text-green-500" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900">
      {InvoiceCount.length}
    </h2>
    <div className="mt-2 h-5 overflow-hidden relative">
      {/* <p className="text-xs text-gray-700 font-semibold animate-scrollText">
        Updated live
      </p> */}
      <p className="text-xs text-gray-700 font-semibold animate-scrollText delay-3">
  Updated live
</p>

    </div>
  </div>

</div>



<div className="bg-white p-5 rounded-2xl shadow mb-10">

  {/* Header Section */}
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>

    <button
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      onClick={() => navigate("/invoicecreate")}
    >
      <Plus size={20} />
      New Invoice
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="border-b text-gray-600 ">
        <tr>
          <th className="p-2">INVOICE ID</th>
          <th className="p-2">CUSTOMER</th>
          <th className="p-2">DATE</th>
          <th className="p-2">AMOUNT</th>
          <th className="p-2">STATUS</th>
          <th className="p-2 text-center">ACTION</th>
        </tr>
      </thead>

      <tbody>
        {InvoiceCount.slice(0, 5).map((list, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50 transition">
            <td className="p-5 font-bold " >{list.invoiceNum}</td>
            <td className="p-2">{list.customerName}</td>
            <td className="p-2">{list.date}</td>
            <td className="p-2">₹{list.subtotal?.toLocaleString()}</td>

            {/* STATUS BADGE */}
            <td className="p-2">
              {list.paymentStatus === "Paid" && (
                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Paid
                </span>
              )}
              {list.paymentStatus === "Pending" && (
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              )}
              {list.paymentStatus === "Overdue" && (
                <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                  Overdue
                </span>
              )}
            </td>

            {/* ACTION BUTTONS */}
            <td className="p-2 flex items-center gap-3 justify-center">

              {/* View */}
              <button
                className="text-blue-600 hover:text-blue-800 transition"
                onClick={() => navigate(`/invoiceview/${list._id}`)}
              >
                <Eye size={20} />
              </button>

              {/* Print */}
              <button
                className="text-gray-700 hover:text-black transition"
                onClick={() => window.print()}   // or custom invoice print page
              >
                <Printer size={20} />
              </button>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



    <div className="border p-4 rounded-2xl mb-4">
  <p className="font-bold mb-3 text-gray-700">Quick Actions</p>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" >

    {/* CREATE INVOICE */}
    <div
      className="group py-11 bg-white shadow-md text-blue-600 
                 rounded-2xl cursor-pointer flex flex-col items-center gap-2
                 transition-all duration-300 
                 hover:bg-blue-600 hover:text-white"
      onClick={() => navigate("/invoicecreate")}
    >
      <FilePlus
        size={30}
        className="text-blue-600 transition-all duration-300 group-hover:text-white"
      />
      <p className="font-semibold">CREATE INVOICE</p>
    </div>

    {/* ADD CUSTOMER */}
    <div
      className="group py-11 bg-white shadow-md text-green-600 
                 rounded-2xl cursor-pointer flex flex-col items-center gap-2
                 transition-all duration-300 
                 hover:bg-green-600 hover:text-white"
      onClick={() => navigate("/setting/customer")}
    >
      <UserPlus
        size={30}
        className="text-green-600 transition-all duration-300 group-hover:text-white"
      />
      <p className="font-semibold">ADD CUSTOMER</p>
    </div>

    {/* ADD PRODUCT */}
    <div
      className="group py-11 bg-white shadow-md text-yellow-600 
                 rounded-2xl cursor-pointer flex flex-col items-center gap-2
                 transition-all duration-300 
                 hover:bg-yellow-500 hover:text-white"
      onClick={() => navigate("/setting/product")}
    >
      <PackagePlus
        size={30}
        className="text-yellow-600 transition-all duration-300 group-hover:text-white"
      />
      <p className="font-semibold">ADD PRODUCT</p>
    </div>

    {/* VIEW REPORTS */}
    <div
      className="group py-11 bg-white shadow-md text-purple-600 
                 rounded-2xl cursor-pointer flex flex-col items-center gap-2
                 transition-all duration-300 
                 hover:bg-purple-600 hover:text-white"
      onClick={() => navigate("/reports")}
    >
      <BarChart3
        size={30}
        className="text-purple-600 transition-all duration-300 group-hover:text-white"
      />
      <p className="font-semibold">VIEW REPORTS</p>
    </div>

  </div>
</div>


 {/* ---------------- SALES TREND GRAPH ---------------- */}
      <div className="bg-white p-5 rounded-2xl shadow mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales Trend</h2>
        <LineChart width={600} height={300} data={salesTrendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
        </LineChart>
      </div>

      {/* ---------------- PAYMENT STATUS PIE ---------------- */}
      <div className="bg-white p-5 rounded-2xl shadow mb-10 flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={statusPieData}
            cx={200}
            cy={150}
            innerRadius={40}
            outerRadius={90}
            dataKey="value"
            label
          >
            <Cell fill="#22C55E" /> {/* Paid */}
            <Cell fill="#FACC15" /> {/* Pending */}
            <Cell fill="#EF4444" /> {/* Overdue */}
          </Pie>
          <Legend />
        </PieChart>
      </div>




    </div>
  );
}





