import React from "react";

export default function ToggleActions({
  leftLabel = "New",
  rightLabel = "List",
  isRightActive,
  onLeftClick,
  onRightClick,
}) {
  return (
    <div className="flex gap-3 justify-between">
      <button
        onClick={onLeftClick}
        className={`px-4 py-2 rounded transition ${
          !isRightActive
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {leftLabel}
      </button>

      <button
        onClick={onRightClick}
        className={`px-4 py-2 rounded transition ${
          isRightActive
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
}
