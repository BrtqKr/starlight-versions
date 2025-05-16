import { InputStream, Rescaler, type RescalerProps } from "@swmansion/smelter";
import { COLORS } from "../../../../styles/colors";
import { useStreamStore } from "./LayoutsSection";
import { INPUT_SIZE } from "./StreamSection";

type Size = "full" | "min";

export default function StreamerWindow({ size = "min" }: { size?: Size }) {
  const { isCameraActive } = useStreamStore();

  const STYLES = {
    full: {
      left: 0,
      top: 0,
      width: INPUT_SIZE.width - 3,
      height: INPUT_SIZE.height - 3,
      borderRadius: 12,
      borderColor: COLORS.white100,
      borderWidth: 1.5,
      rescaleMode: "fill",
    },
    min: {
      left: 32,
      top: 32,
      width: INPUT_SIZE.width / 3,
      height: INPUT_SIZE.height / 3,
      borderRadius: 12,
      borderColor: COLORS.white100,
      borderWidth: 1.5,
      rescaleMode: "fill",
    },
  } satisfies Record<Size, RescalerProps["style"]>;

  const showPlaceholder = !isCameraActive;

  if (showPlaceholder)
    return (
      <Rescaler id="streamer-placeholder" transition={{ durationMs: 500 }} style={STYLES[size]}>
        <InputStream inputId="streamer-placeholder" />
      </Rescaler>
    );

  return (
    <Rescaler id="streamer" transition={{ durationMs: 500 }} style={STYLES[size]}>
      <InputStream inputId="streamer" />
    </Rescaler>
  );
}
