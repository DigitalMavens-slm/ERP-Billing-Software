
// import React from 'react'
// import { Link, Outlet, useLocation } from 'react-router-dom'
// // import "./Settings.css"

// const Settings = () => {
//   const location = useLocation();

//   // if current path includes /supplier → show only Outlet (child)
//   const isChildPage = location.pathname !== "/setting";

//   return (
//     <div className="settings-container">
//       {!isChildPage && (
//         <>
//           <h2>Settings Page</h2>
//           <div className="setting-box-container">
//           <Link to="supplier">
//             <div className="settings-box">
//                 <img src="" alt=""/>
//               <span>My Vendor</span>
//             </div>
//           </Link>

//           <Link to={"customer"}>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span>My Clients</span>
//           </div>
//           </Link>
 
//            <Link to={"subcategory"}>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span>Sub Categories</span>
//           </div>
//           </Link>

//           <Link to={"category"}>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span> Categories</span>
//           </div>
//           </Link>

        
//         <Link to={"brand"}>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span>My Brands</span>
//           </div>
//           </Link>

//            <Link to={"product"}>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span>My Products</span>
//           </div>
//           </Link>

//            <Link>
//           <div className="settings-box">
//             <img src="" alt=""/>
//             <span>Sales Person</span>
//           </div>
//           </Link>
//           </div>
//         </>
//       )}

//       <Outlet />
//     </div>
//   );
// };

// export default Settings;



import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, ShoppingBag, Layers, Folder, Tag, Package, UserCircle } from "lucide-react";

export default function Settings() {
  const location = useLocation();
  const isChildPage = location.pathname !== "/setting";

  const menuItems = [
    { path: "supplier", label: "My Vendor", icon: <ShoppingBag size={36} /> },
    { path: "customer", label: "My Clients", icon: <Users size={36} /> },
    { path: "subcategory", label: "Sub Categories", icon: <Layers size={36} /> },
    { path: "category", label: "Categories", icon: <Folder size={36} /> },

    // second row
    { path: "brand", label: "My Brands", icon: <Tag size={36} /> },
    { path: "product", label: "My Products", icon: <Package size={36} /> },
    { path: "salesperson", label: "Sales Person", icon: <UserCircle size={36} /> },
  ];

  return (
    <div className="w-full p-5">
      {!isChildPage && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">
            Settings
          </h2>

          {/* GRID LAYOUT: 4 on top row, 3 on bottom row */}
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

