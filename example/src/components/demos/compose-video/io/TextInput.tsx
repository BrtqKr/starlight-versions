import type React from "react";
import { create } from "zustand";
import { COLORS } from "../../../../../styles/colors";
import Edit from "../../../../assets/demos/edit.svg";

type LabelStore = {
  labelTextContent: string;
  labelColor: string;
  backgroundColor: string;
  setLabelTextContent: (content: string) => void;
  setLabelColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
};

export const useLabelStore = create<LabelStore>((set) => ({
  labelTextContent: "User john123 donated 30$",
  labelColor: COLORS.red40,
  backgroundColor: COLORS.black100,
  setLabelTextContent: (content) => set({ labelTextContent: content }),
  setLabelColor: (color) => set({ labelColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
}));

export default function TextInputWithColorPickers() {
  const {
    labelTextContent,
    labelColor,
    backgroundColor,
    setLabelTextContent,
    setLabelColor,
    setBackgroundColor,
  } = useLabelStore();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelTextContent(event.target.value);
  };

  const handleTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelColor(event.target.value);
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        value={labelTextContent}
        onChange={handleChange}
        placeholder="Enter text here..."
        className="w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ color: labelColor, backgroundColor: backgroundColor }}
      />
      <div className="flex items-center gap-4">
        <div className="group relative flex flex-col items-center">
          <input
            type="color"
            id="textColor"
            value={labelColor}
            onChange={handleTextColorChange}
            className="h-10 w-20 cursor-pointer rounded-md border border-demos-border"
          />
          <img
            alt="edit"
            src={Edit.src}
            className="pointer-events-none absolute mt-2 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
        <div className="group relative flex flex-col items-center">
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="h-10 w-20 cursor-pointer rounded-md border border-demos-border"
          />
          <img
            alt="edit"
            src={Edit.src}
            className="pointer-events-none absolute mt-2 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
