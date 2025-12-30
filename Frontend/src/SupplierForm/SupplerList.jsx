// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import api from "../api";
// import useFetchList from "../customHooks/useFetchList"
// import useDeleteItem from "../customHooks/useDelete"
// import PageActions from "../Components/PageActions"


// function SupplierList() {
//   const navigate = useNavigate();
// const {data:suppliers,loading}=useFetchList("/api/suppliers")
// const {deleteItem}=useDeleteItem("/api/suppliers")
//   return (
//    <div className="p-6">
//   {/* Header */}
//   {/* <div className="flex items-center justify-between mb-4">
//     <h2 className="text-xl font-semibold text-gray-800">
//       Customer List
//     </h2>

//     <button
//       onClick={() => navigate("/setting/supplier")}
//       className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//     >
//       + New Customer
//     </button>
//   </div> */}
//   <PageActions
//            listPath1="/setting/supplier"
//            listPath2="/setting/supplierlist"
//     listLabel1="New Supplier "/>

//   {/* Table */}
//   <div className="overflow-x-auto bg-white rounded-lg shadow">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//         <tr>
//           <th className="px-4 py-3 text-left">Name</th>
//           <th className="px-4 py-3 text-left">Email</th>
//           <th className="px-4 py-3 text-left">GST</th>
//           <th className="px-4 py-3 text-left">Phone</th>
//           <th className="px-4 py-3 text-left">Contact Person</th>
//           <th className="px-4 py-3 text-center">Action</th>
//         </tr>
//       </thead>

//       <tbody className="divide-y">
//         {suppliers.map((s) => (
//           <tr
//             key={s._id}
//             className="hover:bg-gray-50"
//           >
//             <td className="px-4 py-3 font-medium text-gray-800">
//               {s.name}
//             </td>
//             <td className="px-4 py-3 text-gray-600">
//               {s.email || "-"}
//             </td>
//             <td className="px-4 py-3 text-gray-600">
//               {s.gst || "-"}
//             </td>
//             <td className="px-4 py-3 text-gray-600">
//               {s.mobile}
//             </td>
//             <td className="px-4 py-3 text-gray-600">
//               {s.contactPerson || "-"}
//             </td>

//             <td className="px-4 py-3 text-center space-x-2">
//               <button
//                 onClick={() =>
//                   navigate(`/customer/view/${s._id}`)
//                 }
//                 className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
//               >
//                 View
//               </button>

//               <button
//                 onClick={() => handleDelete(s._id)}
//                 className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
//               >
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>

//   );
// }

// export default SupplierList;



import { useEffect, useState } from "react";
import useFetchList from "../customHooks/useFetchList";
import useDeleteItem from "../customHooks/useDelete";
import CommonList from "../Components/CommonList";


function SupplierList() {
  const { data: suppliers = [] } = useFetchList("/api/suppliers");
  const [list, setList] = useState([]);


  console.log(list)
  useEffect(() => {
    setList(suppliers);
  }, [suppliers]);

  const { deleteItem } = useDeleteItem("/api/suppliers");

  const handleDelete = async (id) => {
    await deleteItem(id);
    setList(prev => prev.filter(s => s._id !== id));
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "GST", key: "gst" },
    { label: "Phone", key: "mobile" },
    { label: "Contact Person", key: "contactPerson" }
  ];

  return (
    <CommonList
      title="Supplier"
      newPath="/setting/supplier"
      listPath="/setting/supplierlist"
      columns={columns}
      data={list}
      onDelete={handleDelete}
    />
  );
}

export default SupplierList;
