
import React, { useEffect, useState } from "react";
import Axios from "axios";
// import "./Sales.css";
import { useSuggestions } from "../../Context/SuggestionContext"; // ✅ correct import

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    product: "",
    quantity: 1,
    price: 0,
  });

  // ✅ from SuggestionContext
  const { suggestions, updateSuggestions } = useSuggestions();

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await Axios.get("http://localhost:4000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle input changes + suggestions
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
     console.log(newOrder)

    if (["customerName", "product"].includes(name) && value.trim()) {
      try {
        const res = await Axios.get(
          `http://localhost:4000/api/orders/searchField?field=${name}&query=${value}`
        );
        console.log(res.data);
        
        updateSuggestions(name, res.data);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    } else {
      updateSuggestions(name, []);
    }
  };

  const selectSuggestion = (field, value) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
    updateSuggestions(field, []);
  };

  // Add order
  const addOrder = async () => {
    try {
      await Axios.post("http://localhost:4000/api/orders", newOrder);
      setNewOrder({ customerName: "", product: "", quantity: 1, price: 0 });
      fetchOrders();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await Axios.delete(`http://localhost:4000/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales Orders</h1>

      <div className="input-section">
        <div className="input-wrapper">
          <input
            name="customerName"
            placeholder="Customer Name"
            value={newOrder.customerName}
            onChange={handleChange}
            autoComplete="off"
          />
          {suggestions.customerName?.length > 0 && (
            <ul className="suggestions">
              {suggestions.customerName.map((s, i) => (
                <li key={i} onClick={() => selectSuggestion("customerName", s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-wrapper">
          <input
            name="product"
            placeholder="Product"
            value={newOrder.product}
            onChange={handleChange}
            autoComplete="off"
          />
          {suggestions.product?.length > 0 && (
            <ul className="suggestions">
              {suggestions.product.map((p, i) => (
                <li key={i} onClick={() => selectSuggestion("product", p)}>
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newOrder.quantity}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newOrder.price}
          onChange={handleChange}
        />

        <button onClick={addOrder}>Add Order</button>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>
                <button onClick={() => deleteOrder(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
