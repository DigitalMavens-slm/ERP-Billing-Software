import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import "./AutocompleteInput.css";

const AutocompleteInput = ({ field, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const wrapperRef = useRef(null);

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  const handleChange = (e) => {
    const val = e.target.value;
    onChange(field, val);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    setTypingTimeout(
      setTimeout(async () => {
        try {
          const res = await Axios.get(
            `http://localhost:4000/api/purchases/searchField?field=${field}&query=${val}`
          );
          setSuggestions(res.data);
          setActiveIndex(-1);
        } catch (err) {
          console.error("Suggestion fetch error:", err);
        }
      }, 300) // 300ms delay
    );
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      }
    }
  };

  const selectSuggestion = (val) => {
    onChange(field, val);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        placeholder={field === "supplierName" ? "Supplier Name" : "Product"}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={i === activeIndex ? "active" : ""}
              onClick={() => selectSuggestion(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
