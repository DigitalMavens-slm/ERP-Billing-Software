import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import {
  Users,
  ShoppingBag,
  Layers,
  Folder,
  Tag,
  Package,
  UserCircle,
} from "lucide-react";

export default function Settings() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role; // "admin" or "staff"

  const isChildPage = location.pathname !== "/setting";

  // =============================
  // ROLE-BASED MENU ITEMS
  // =============================
  const adminItems = [
    { path: "supplier", label: "My Vendor", icon: <ShoppingBag size={36} /> },
    { path: "customer", label: "My Clients", icon: <Users size={36} /> },
    { path: "subcategory", label: "Sub Categories", icon: <Layers size={36} /> },
    { path: "category", label: "Categories", icon: <Folder size={36} /> },
    { path: "brand", label: "My Brands", icon: <Tag size={36} /> },
    { path: "product", label: "My Products", icon: <Package size={36} /> },
    // { path: "salesperson", label: "Sales Person", icon: <UserCircle size={36} /> },
  ];

  const staffItems = [
    { path: "customer", label: "My Clients", icon: <Users size={36} /> },
    { path: "product", label: "My Products", icon: <Package size={36} /> },
    { path: "subcategory", label: "Sub Categories", icon: <Layers size={36} /> },
    { path: "category", label: "Categories", icon: <Folder size={36} /> },
  ];

  // FINAL MENU BASED ON ROLE
  const menuItems = role === "admin" ? adminItems : staffItems;

  return (
    <div className="w-full p-5">
      {!isChildPage && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Settings</h2>

          {/* GRID LAYOUT */}
          <div
            className="
              grid 
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
              place-items-center
            "
          >
            {menuItems.map((item) => (
              <Link
                to={item.path}
                key={item.label}
                className="
                  w-full
                  max-w-[180px]
                  flex flex-col items-center
                "
              >
                <div
                  className="
                    w-28 h-28
                    rounded-full
                    bg-gray-100
                    flex items-center justify-center
                    shadow
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    cursor-pointer
                  "
                >
                  {item.icon}
                </div>

                <span className="mt-3 text-gray-700 font-medium text-lg text-center">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <Outlet />
    </div>
  );
}
