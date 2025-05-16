import { InputStream, Rescaler, View } from "@swmansion/smelter";
import type Smelter from "@swmansion/smelter-web-wasm";
import { COLORS } from "../../../../../styles/colors";
import SmelterCanvasOutput from "../../smelter-utils/SmelterCanvasOutput";

export const INPUT_SIZE = { width: 320, height: 180 };

type StreamProps = {
  smelter?: Smelter;
};

export default function Stream({ smelter }: StreamProps) {
  if (!smelter) {
    return <div className="bg-demos-background" style={{ ...INPUT_SIZE }} />;
  }

  return (
    <div className="bg-demos-background">
      <SmelterCanvasOutput smelter={smelter} width={INPUT_SIZE.width} height={INPUT_SIZE.height}>
        <View style={{ backgroundColor: COLORS.black100 }}>
          <Rescaler
            style={{
              borderRadius: 16,
              borderColor: COLORS.white100,
              borderWidth: 1.5,
            }}>
            <InputStream inputId="stream" />
          </Rescaler>
        </View>
      </SmelterCanvasOutput>
    </div>
  );
}
