// import { useEffect, useState } from "react";
// import axios from "axios";
// const API_URL=import.meta.env.VITE_API_URL

// export default function Inventory() {
//   const [inventory, setInventory] = useState([]);

//   useEffect(() => {
//     axios.get(`${API_URL}/api/allinventory`).then((res) => {
//       console.log(res.data)
//       setInventory(res.data);
//     });
//   }, []);

//   return (
//     <div>
//       <h2>Stock Items</h2>
//      <table>
//       <thead>
//         <tr>
//           <td>Product Name</td>  <td>Quantity</td>
//         </tr>
//       </thead>
//       {inventory.map((item) => (
//         <div className="card" key={item._id}>
//           <h3>{item.productId}</h3>
//           {/* <p>Stock: {item.qty}</p> */}

//           {item.qty < item.minQty && (
//             <>
//             <tbody>
//                 <td>{item.productName}</td><td>{item.quantity}</td>
//             </tbody>
//             <p style={{ color: "red", fontWeight: "bold" }}>
//               ⚠ Low Stock — Please Purchase!
//             </p>
//             </>
//           )}
//         </div>
//       ))}
//       </table>
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
    const res = await axios.get(`${API_URL}/api/allinventory`);
    setInventory(res.data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">📦 Inventory Stock</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left font-semibold">Product Name</th>
              <th className="py-3 px-4 text-left font-semibold">Quantity</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-700">
                  {item?.productName}
                </td>

                <td className="py-3 px-4 font-semibold">
                  {item.quantity}
                </td>

                <td className="py-3 px-4">
                  {item.qty < item.minQty ? (
                    <span className="px-3 py-1 text-xs font-bold rounded bg-red-500 text-white">
                      LOW STOCK
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-boldy rounded bg-green-600 text-white">
                      IN STOCK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
