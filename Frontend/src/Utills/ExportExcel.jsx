// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;
import  api from "../api"

export const ExportExcel = async (moduleName) => {
  console.log(moduleName)
  try {
    const res = await api.get(`/api/export/${moduleName}/export/excel`, {
      responseType: "blob", // important for file download
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${moduleName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    alert("file exported")
  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed! Check console for details.");
  }
};
