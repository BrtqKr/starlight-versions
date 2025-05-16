import { create } from "zustand";
import layout1 from "../../../assets/demos/streaming-app/layout1.svg";
import layout2 from "../../../assets/demos/streaming-app/layout2.svg";
import layout3 from "../../../assets/demos/streaming-app/layout3.svg";
import layout4 from "../../../assets/demos/streaming-app/layout4.svg";

export const LAYOUTS = [
  { id: "layout-streamer", image: layout1 },
  { id: "layout-chat", image: layout2 },
  { id: "layout-message", image: layout3 },
  { id: "layout-camera", image: layout4 },
] as const;

export type LayoutVariant = (typeof LAYOUTS)[number]["id"] | null;

type StreamStore = {
  currentLayout: LayoutVariant;
  isCameraActive: boolean;
  twitchKey?: string;
  setCurrentLayout: (layout: LayoutVariant) => void;
  setIsCameraActive: (isCameraActive: boolean) => void;
  setTwitchKey: (twitchKey: string) => void;
};

export const useStreamStore = create<StreamStore>((set) => ({
  currentLayout: LAYOUTS[0].id,
  isCameraActive: false,
  setCurrentLayout: (layout: LayoutVariant) => set({ currentLayout: layout }),
  setIsCameraActive: (isCameraActive: boolean) => set({ isCameraActive }),
  setTwitchKey: (twitchKey: string) => set({ twitchKey }),
}));

export default function LayoutsSection() {
  const { currentLayout, setCurrentLayout } = useStreamStore();

  return (
    <div className="-mt-10 flex max-w-[300px] flex-1 flex-col gap-y-4">
      <p className="text-demos-subheader">Select layout:</p>
      {LAYOUTS.map((layout) => (
        <button
          type="button"
          key={layout.id}
          className="aspect-video transition-all hover:scale-[1.02]"
          onClick={() => {
            setCurrentLayout(layout.id);
          }}>
          <img
            src={layout.image.src}
            alt={layout.id}
            style={{ opacity: currentLayout === layout.id ? "1" : "0.30" }}
            className={
              "aspect-video w-full rounded-lg border border-solid transition-opacity duration-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
