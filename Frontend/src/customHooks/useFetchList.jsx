// hooks/useFetchList.js
import { useEffect, useState } from "react";
import api from "../api";

export default function useFetchList(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(url).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [url]);

  return { data, loading };
}
