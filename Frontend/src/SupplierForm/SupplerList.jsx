

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
    { label: "GST", key: "gstin" },
    { label: "Phone", key: "phone" },
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
