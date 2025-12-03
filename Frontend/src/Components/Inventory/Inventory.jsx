
// import { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function Inventory() {
//   const [inventory, setInventory] = useState([]);
// // console.log(inventory)
//   useEffect(() => {
//     loadInventory();
//   }, []);

//   const loadInventory = async () => {
//     const res = await axios.get(`${API_URL}/api/allinventory`, {withCredentials: true});
//     setInventory(res.data);
    
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold text-center mb-6">📦 Inventory Stock</h2>

//       <div className="overflow-x-auto shadow-lg rounded-lg">
//         <table className="min-w-full bg-white border rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-3 px-4 text-left font-semibold">Product Name</th>
//               <th className="py-3 px-4 text-left font-semibold">Quantity</th>
//               <th className="py-3 px-4 text-left font-semibold">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {inventory.map((item) => (
//               <tr
//                 key={item._id}
//                 className="border-b hover:bg-gray-50 transition"
//               >
//                 <td className="py-3 px-4 font-medium text-gray-700">
//                   {item?.productId?.name}
//                 </td>

//                 <td className="py-3 px-4 font-semibold">
//                   {item.minQty}
//                 </td>

//                 <td className="py-3 px-4">
//                   {item.qty < item.minQty ? (
//                     <span className="px-3 py-1 text-xs font-bold rounded bg-red-500 text-white">
//                       LOW STOCK
//                     </span>
//                   ) : (
//                     <span className="px-3 py-1 text-xs font-boldy rounded bg-green-600 text-white">
//                       IN STOCK
//                     </span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const res = await axios.get(`${API_URL}/api/allinventory`, {
      withCredentials: true,
    });
    setInventory(res.data);
  };

  const getStatusBadge = (available, minQty) => {
    if (available <= 0)
      return (
        <span className="px-3 py-1 text-xs font-bold rounded bg-red-700 text-white">
          OUT OF STOCK
        </span>
      );

    if (available < minQty)
      return (
        <span className="px-3 py-1 text-xs font-bold rounded bg-red-500 text-white">
          LOW STOCK
        </span>
      );

    return (
      <span className="px-3 py-1 text-xs font-bold rounded bg-green-600 text-white">
        IN STOCK
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">📊 Inventory Dashboard</h2>

      <div className="overflow-x-auto shadow-xl rounded-lg border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-center">Purchased</th>
              <th className="py-3 px-4 text-center">Sold</th>
              <th className="py-3 px-4 text-center">Available</th>
              <th className="py-3 px-4 text-center">Min Qty</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => {
              const purchased = item.totalPurchased || 0; // if you add later
              const sold = item.totalSold || 0; // from invoice reduce logic
              const available = item.minQty; // your available stock

              return (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {item?.productId?.name}
                  </td>

                  <td className="py-3 px-4 text-center text-blue-600 font-semibold">
                    {purchased}
                  </td>

                  <td className="py-3 px-4 text-center text-red-600 font-semibold">
                    {sold}
                  </td>

                  <td className="py-3 px-4 text-center font-semibold">
                    {available}
                  </td>

                  <td className="py-3 px-4 text-center text-orange-600 font-semibold">
                    {item.minQty}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(available, item.minQty)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

