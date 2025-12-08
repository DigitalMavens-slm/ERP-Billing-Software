// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL;

import api from "../api"


export const ImportExcel = async (moduleName, file) => {
 
   
  try {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

   else{
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/api/import/${moduleName}/excel`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(`✅ data imported successfully!`);
    console.log("Import response:", res.data);
}

  } catch (err) {
    console.error("Import failed:", err);
    alert("Import failed! Check console for details.");
  }
};
