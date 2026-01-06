
import React, { useEffect, useState } from "react";
// import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
// import "./Reports.css";

import api from "../api"

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "sales",
    party: "all",
  });

  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netCash: 0,
    invoices: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [rows, setRows] = useState([]);
  console.log(rows)
  const [loading, setLoading] = useState(false);

  // Fetch report data
  const fetchReportData = async (params = filters) => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        from: params.from,
        to: params.to,
        type: params.type,
        party: params.party,
      }).toString();

      const res = await api.get(`/api/reports?${query}`);
      const data = res.data;

      // FIX 1 → backend sends chart, not chartData
      setKpis(data.kpis || {});
      setChartData(data.chart || data.chartData || []);
      setRows(data.records || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };


  
  // Auto fetch when type changes
  useEffect(() => {
    fetchReportData(filters);
  }, [filters.type]);

  // Filters change
  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchReportData(filters);

  const resetFilters = () => {
    const base = { from: "", to: "", type: "sales", party: "all" };
    setFilters(base);
    fetchReportData(base);
  };

  const formatCurrency = (n) =>
    n?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }) ?? "—";

  // Dynamic chart title
  const getChartTitle = () => {
    if (filters.type === "sales") return "Sales Trend";
    if (filters.type === "purchases") return "Purchase Trend";
    if (filters.type === "cashflow") return "Cash Flow Trend";
  };

return (
  <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

    {/* ================= HEADER ================= */}
    <header className="mb-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
        📊 Reports Dashboard
      </h1>
      <p className="text-gray-600 text-sm">
        Insights — Sales, Purchases & Cashflow Overview
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">

      {/* ================= FILTER SIDEBAR ================= */}
      <aside className="bg-sandel border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Filters
        </h2>

        <div className="space-y-3">

          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={onFilterChange}
              className="border rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={onFilterChange}
              className="border rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={onFilterChange}
              className="border rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="sales">Sales</option>
              <option value="purchases">Purchases</option>
              <option value="cashflow">Cash Flow</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer / Vendor
            </label>
            <input
              name="party"
              placeholder="All"
              value={filters.party}
              onChange={onFilterChange}
              className="border rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={applyFilters}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-md text-sm shadow"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-md text-sm shadow"
            >
              Reset
            </button>
          </div>

        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="space-y-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Sales" value={formatCurrency(kpis.totalSales)} />
          <KpiCard title="Purchases" value={formatCurrency(kpis.totalPurchases)} />
          <KpiCard title="Net Cash" value={formatCurrency(kpis.netCash)} />
          <KpiCard title="Invoices" value={kpis.invoices} />
        </div>

        {/* CHART */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
            {getChartTitle()}
          </h3>

          <div className="w-full h-[240px] md:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>
    </div>

    {/* ================= TABLE SECTION ================= */}
    <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm mt-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
        Records
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-indigo-100 text-indigo-900">
              <th className="p-3">Date</th>
              <th className="p-3 hidden sm:table-cell">Ref</th>
              <th className="p-3">Party</th>
              <th className="p-3 hidden md:table-cell">Type</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-600">
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r._id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                  } border-b hover:bg-indigo-100 transition`}
                >
                  <td className="p-3">{r.date}</td>
                  <td className="p-3 hidden sm:table-cell">{r.reference}</td>
                  <td className="p-3">{r.party}</td>
                  <td className="p-3 hidden md:table-cell">{r.type}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(r.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>

  </div>
);


}

function KpiCard({ title, value }) {
  return (
    <div className="
      bg-white
      border border-gray-200
      rounded-xl
      p-4
      shadow-sm
      hover:shadow-md
      transition-all
      flex flex-col
      gap-1
    ">
      <div className="text-xs md:text-sm font-medium text-gray-600">
        {title}
      </div>

      <div className="text-xl md:text-2xl font-bold text-indigo-600">
        {value}
      </div>
    </div>
  );
}

