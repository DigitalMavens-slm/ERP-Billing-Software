import { useEffect, useState } from "react";
import api from "../api";

const usePagination = (url, key,totalKey) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const resPerPage = 10;

  useEffect(() => {
    api.get(`${url}?page=${page}`)
      .then((res) => {
        setData(res.data[key]);
        setTotalCount(res.data[totalKey]);
      })
      .catch(console.log);
  }, [url, page]);

  const totalPages = Math.ceil(totalCount / resPerPage);

  return {
    data,
    page,
    totalPages,
    next: () => page < totalPages && setPage(page + 1),
    prev: () => page > 1 && setPage(page - 1),
  };
};

export default usePagination;
