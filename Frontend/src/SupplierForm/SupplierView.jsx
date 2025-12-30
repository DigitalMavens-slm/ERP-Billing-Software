import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function SupplierView() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    api.get(`/suppliers/${id}`).then(res => {
      setSupplier(res.data);
    });
  }, [id]);

  if (!supplier) return <p>Loading...</p>;

  return (
    <div>
      <h2>Supplier Details</h2>
      <p>Name: {supplier.name}</p>
      <p>Mobile: {supplier.mobile}</p>
      <p>Email: {supplier.email}</p>
      <p>Address: {supplier.address}</p>
    </div>
  );
}

export default SupplierView;
