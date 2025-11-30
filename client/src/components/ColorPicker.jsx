import { Check, Palette } from "lucide-react";
import React, { useState } from "react";

const colors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Gray", value: "#6B7280" },
];

export default function ColorPicker({ selectedColor, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (colorValue) => {
    onChange(colorValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex px-3 py-2 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg transition-all items-center gap-1 ring-purple-300 hover:ring"
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-4 z-10 w-60 p-3 mt-2 bg-white rounded-md border border-gray-200 shadow-sm gap-2 absolute top-full left-0 right-0">
          {colors.map((color) => (
            <div
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className="flex flex-col cursor-pointer relative group"
            >
              <div
                style={{ backgroundColor: color.value }}
                className="w-12 h-12 rounded-full border-2 border-transparent transition-colors group-hover:border-black/25"
              />
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center">
                  <Check className="text-white size-5" />
                </div>
              )}
              <p className="text-xs text-center mt-1 text-gray-600">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
