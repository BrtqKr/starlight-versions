import { InputStream, Rescaler, Tiles, View } from "@swmansion/smelter";
import { COLORS } from "../../../../../styles/colors";
import { useCameraStore } from "./Camera";
import { OUTPUT_SIZE } from "./Output";

export default function CameraContent() {
  const { cameraInputsCount } = useCameraStore();

  return (
    <View
      style={{
        left: 0,
        top: 0,
        paddingVertical: 8,
        paddingLeft: 8,
        width: OUTPUT_SIZE.width / 2 - 32,
        height: OUTPUT_SIZE.height / 2,
      }}>
      <Tiles
        transition={{ durationMs: 200 }}
        style={{ margin: 4, horizontalAlign: "left", verticalAlign: "top" }}>
        {Array.from({ length: cameraInputsCount }, (_item, index) => (
          <Rescaler
            // biome-ignore lint/suspicious/noArrayIndexKey: ignore
            key={index}
            style={{
              borderRadius: 12,
              borderColor: COLORS.white100,
              borderWidth: 1.5,
              rescaleMode: "fill",
            }}>
            <InputStream id={`camera${index}`} inputId="camera" />
          </Rescaler>
        ))}
      </Tiles>
    </View>
  );
}
