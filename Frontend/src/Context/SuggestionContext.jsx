
import React, { createContext, useState, useContext,useEffect } from "react";

 const SuggestContext = createContext(null);

export const SuggestionProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState({}); 
  //  const [customerId, setCustomerId] = useState("");
   const [customerId, setCustomerId] = useState(() => {
    // 🔹 Load from localStorage on first render
    // return localStorage.getItem("customerId") || "";
  });
console.log(customerId)

  useEffect(() => {
    if (customerId) {
      localStorage.setItem("customerId", customerId);
    }
  }, [customerId]);

  const updateSuggestions = (field, values) => {
    setSuggestions((prev) => ({ ...prev, [field]: values }));
  };

  return (
    <SuggestContext.Provider value={{ suggestions, updateSuggestions,customerId, setCustomerId }}>
      {children}
    </SuggestContext.Provider>
  );
};

// Hook to use suggestions easily
export const useSuggestions = () => useContext(SuggestContext);
