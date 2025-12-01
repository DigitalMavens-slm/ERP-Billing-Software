import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  FileText,
  CreditCard,
  Boxes,
  Settings,
  BarChart,
  Building,
  Bell,
  User2,
  Menu,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from "lucide-react";

const Mainpage = () => {
  const location = useLocation();
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openSales, setOpenSales] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openLedger, setOpenLedger] = useState(false);


  const isActive = (path) => location.pathname.includes(path);
  
  const logout = async () => {
  try {
    await axios.post("http://localhost:4000/api/logout", {}, { 
      withCredentials: true 
    });

    localStorage.removeItem("auth-token");   // remove local copy too
    window.location.replace("/login");       // go to login page
  } catch (error) {
    console.log("Logout failed:", error);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fb]">

      {/* TOP NAVBAR */}
      <header className="w-full bg-white shadow flex justify-between items-center px-4 py-3 border-b">
        
        <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-7 h-7" />
        </button>

        <h1 className="text-xl font-bold text-blue-800">ERP Billing — SOFTWARE</h1>

        <div className="flex items-center gap-5">
          <Bell className="w-6 h-6 cursor-pointer" />

          <User2 className="w-7 h-7 cursor-pointer"/>
          <ArrowRight size={24} color="blue" onClick={() => logout()}/>
        </div>
      </header>

      <div className="flex flex-1">

        {/* LEFT SIDEBAR */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full w-64 bg-white border-r
            flex flex-col pt-4 transition-transform duration-300 z-40
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >

          {/* Menu: SURVEY STYLE */}
            <button onClick={() => setSidebarOpen(false)}>close</button>

          <Link
            to="dashboard"
            className={`sidebar-btn ${isActive("dashboard") ? "sidebar-active" : ""}`}
          >
            <Home size={20} />
            Dashboard
          </Link>

          {/* PURCHASE MENU */}
          <button
            onClick={() => setOpenPurchase(!openPurchase)}
            className={`sidebar-btn w-full justify-between ${
              openPurchase ? "sidebar-active" : ""
            }`}
          >
            <span className="flex gap-3">
              <ShoppingCart size={20} />
              Purchase
            </span>
            <ChevronDown size={18} />
          </button>

          {openPurchase && (
            <div className="flex flex-col">
              <Link to="index" className="sub-item"><ChevronRight size={16} /> New Purchase</Link>
              <Link to="purchaselist" className="sub-item"><ChevronRight size={16} /> Purchase List</Link>
              {/* <Link to="purchaseledger" className="sub-item"><ChevronRight size={16} /> Purchase Return</Link> */}
            </div>
          )}

          {/* SALES MENU */}
          <button
            onClick={() => setOpenSales(!openSales)}
            className={`sidebar-btn w-full justify-between ${
              openSales ? "sidebar-active" : ""
            }`}
          >
            <span className="flex gap-3">
              <FileText size={20} />
              Sales
            </span>
            <ChevronDown size={18} />
          </button>

          {openSales && (
            <div className="flex flex-col">
              <Link to="invoicecreate" className="sub-item"><ChevronRight size={16} /> New Sale</Link>
              <Link to="invoicelist" className="sub-item"><ChevronRight size={16} /> Sales List</Link>
              {/* <Link to="sales/return" className="sub-item"><ChevronRight size={16}/> Sales Return</Link> */}
            </div>
          )}   


        {/* LEDGER MENU */}


          {/* OTHER STATIC MENU ITEMS */}
          <Link
            to="payment-updation"
            className={`sidebar-btn ${isActive("payment-updation") ? "sidebar-active" : ""}`}
          >
            <CreditCard size={20} /> Payment
          </Link>

          <Link
            to="inventory"
            className={`sidebar-btn ${isActive("inventory") ? "sidebar-active" : ""}`}
          >
            <Boxes size={20} /> Inventory
          </Link>

          <Link
            to="setting"
            className={`sidebar-btn ${isActive("setting") ? "sidebar-active" : ""}`}
          >
            <Settings size={20} /> Settings
          </Link>

          <Link
            to="reports"
            className={`sidebar-btn ${isActive("reports") ? "sidebar-active" : ""}`}
          >
            <BarChart size={20} /> Reports
          </Link>

<button
  onClick={() => setOpenLedger(!openLedger)}
  className={`sidebar-btn w-full justify-between ${
    openLedger ? "sidebar-active" : ""
  }`}
>
  <span className="flex gap-3">
    <CreditCard size={20} />
    Ledger
  </span>
  <ChevronDown size={18} />
</button>

{openLedger && (
  <div className="flex flex-col">
    <Link to="ledger" className="sub-item">
      <ChevronRight size={16} /> Customer Ledger
    </Link>

    <Link to="purchaseledger" className="sub-item">
      <ChevronRight size={16} /> Supplier Ledger
    </Link>
  </div>
)}
          <Link
            to="company"
            className={`sidebar-btn ${isActive("company") ? "sidebar-active" : ""}`}
          >
            <Building size={20} /> Company
          </Link>
        </aside>

        {/* RIGHT PANEL */}
        <main className="flex-1 p-6 bg-[#f5f7fb] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Mainpage;
