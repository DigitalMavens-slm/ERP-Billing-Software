import { useState } from "react";
import api from "../api";

export default function useDeleteItem(url, onSuccess) {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      setLoading(true);
      await api.delete(`${url}/${id}`);
      onSuccess?.();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading };
}
