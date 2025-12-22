import { create } from "zustand";

const useFinancialYearStore = create((set) => ({
  financialYear: localStorage.getItem("financialYear"),

  setFinancialYear: (year) => {
    localStorage.setItem("financialYear", year);
    set({ financialYear: year }); // 🔥 trigger re-render everywhere
  },
}));


export default useFinancialYearStore;
