// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api";

// function SupplierView() {
//   const { id } = useParams();
//   const [supplier, setSupplier] = useState(null);

//   useEffect(() => {
//     api.get(`/suppliers/${id}`).then(res => {
//       setSupplier(res.data);
//     });
//   }, [id]);

//   if (!supplier) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Supplier Details</h2>
//       <p>Name: {supplier.name}</p>
//       <p>Mobile: {supplier.mobile}</p>
//       <p>Email: {supplier.email}</p>
//       <p>Address: {supplier.address}</p>
//     </div>
//   );
// }

// export default SupplierView;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function SupplierView() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    api.get(`/suppliers/${id}`).then((res) => {
      setSupplier(res.data);
    });
  }, [id]);

  if (!supplier)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border p-5 md:p-6">

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Supplier Details
        </h2>

        <div className="space-y-4 text-sm md:text-base">

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <span className="font-semibold text-gray-600 w-28">
              Name
            </span>
            <span className="text-gray-800">
              {supplier.name || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <span className="font-semibold text-gray-600 w-28">
              Mobile
            </span>
            <span className="text-gray-800">
              {supplier.mobile || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <span className="font-semibold text-gray-600 w-28">
              Email
            </span>
            <span className="text-gray-800 break-all">
              {supplier.email || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
            <span className="font-semibold text-gray-600 w-28">
              Address
            </span>
            <span className="text-gray-800">
              {supplier.address || "-"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SupplierView;
