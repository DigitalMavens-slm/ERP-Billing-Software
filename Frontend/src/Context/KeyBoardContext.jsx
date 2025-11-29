// import React, { createContext, useContext, useState } from "react";

// const KeyBoardContext = createContext();

// export const KeySuggestionProvider = ({ children }) => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [highlightIndex, setHighlightIndex] = useState(-1);

//   const handleKeyDown = (e, handleSelect) => {
//     if (suggestions.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightIndex((prev) =>
//         prev < suggestions.length - 1 ? prev + 1 : 0
//       );
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightIndex((prev) =>
//         prev > 0 ? prev - 1 : suggestions.length - 1
//       );
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (highlightIndex >= 0) handleSelect(suggestions[highlightIndex]);
//     }
//   };

//   return (
//     <KeyBoardContext.Provider
//       value={{
//         suggestions,
//         setSuggestions,
//         highlightIndex,
//         setHighlightIndex,
//         handleKeyDown,
//       }}
//     >
//       {children}
//     </KeyBoardContext.Provider>
//   );
// };

// export const useSuggestion = () => useContext(KeyBoardContext);


import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const KeyBoardContext = createContext();

export const KeySuggestionProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // 🔹 Create refs for suggestion items
  const suggestionRefs = useRef([]);

  // 🔹 Auto-scroll selected item into view
  useEffect(() => {
    if (
      highlightIndex >= 0 &&
      suggestionRefs.current[highlightIndex]
    ) {
      suggestionRefs.current[highlightIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightIndex]);

  const handleKeyDown = (e, handleSelect) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) handleSelect(suggestions[highlightIndex]);
    }
  };

  return (
    <KeyBoardContext.Provider
      value={{
        suggestions,
        setSuggestions,
        highlightIndex,
        setHighlightIndex,
        handleKeyDown,
        suggestionRefs,
      }}
    >
      {children}
    </KeyBoardContext.Provider>
  );
};

export const useSuggestion = () => useContext(KeyBoardContext);
