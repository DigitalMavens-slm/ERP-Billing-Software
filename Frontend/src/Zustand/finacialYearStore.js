// import { create } from "zustand";

// const useFinancialYearStore = create((set) => ({
//   financialYear: localStorage.getItem("financialYear"),

//   setFinancialYear: (year) => {
//     localStorage.setItem("financialYear", year);
//     set({ financialYear: year }); 
//   },
// }));


// export default useFinancialYearStore;



import { create } from "zustand";

const getFY = () => {
  const d = new Date();
  const y = d.getFullYear();
  return d.getMonth() >= 3 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
};

const useFinancialYearStore = create((set) => ({
  activeFY: localStorage.getItem("fy") || getFY(),

  setActiveFY: (fy) => {
    localStorage.setItem("fy", fy);
    set({ activeFY: fy });
  },

  getFY, // optional-aa expose pannren
}));

export default useFinancialYearStore;
