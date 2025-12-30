import { useEffect, useState } from "react";
import api from "../api";

export default function useFetchById(url, id) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`${url}/${id}`).then(res => {
      setData(res.data);
    });
  }, [url, id]);

  return data;
}
