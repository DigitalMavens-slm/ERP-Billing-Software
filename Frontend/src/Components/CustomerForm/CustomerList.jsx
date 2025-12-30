// import useFetchList from "../../customHooks/useFetchList";
// import useDeleteItem from "../../customHooks/useDelete";
// import CommonList from "../CommonList";

// function CustomerList() {
//   const { data: customers = [] } = useFetchList("/api/customers");
//  const { deleteItem } = useDeleteItem("/api/suppliers");

//   const columns = [
//     { label: "Name", key: "name" },
//     { label: "Email", key: "email" },
//     { label: "GST", key: "gst" },
//     { label: "Phone", key: "mobile" }
//   ];

//   return (
//     <CommonList
//       title="Customer"
//       newPath="/setting/customer"
//       listPath="/setting/customerlist"
//       columns={columns}
//       data={customers}
//       onView={(id) => console.log("View customer", id)}
//       onDelete={(id) => deleteItem(id)}
//     />
//   );
// }

// export default CustomerList;



import { useEffect, useState } from "react";
import useFetchList from "../../customHooks/useFetchList";
import useDeleteItem from "../../customHooks/useDelete";
import CommonList from "../CommonList";

function CustomerList() {
  const { data: customers = [] } = useFetchList("/api/customers");
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(customers);
  }, [customers]);

  const { deleteItem } = useDeleteItem("/api/customers");

  const handleDelete = async (id) => {
    await deleteItem(id);
    setList(prev => prev.filter(c => c._id !== id)); 
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "GST", key: "gst" },
    { label: "Phone", key: "mobile" }
  ];

  return (
    <CommonList
      title="Customer"
      newPath="/setting/customer"
      listPath="/setting/customerlist"
      columns={columns}
      data={list}
      onDelete={handleDelete}
    />
  );
}

export default CustomerList;

