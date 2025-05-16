import { InputStream, Rescaler, Text, View } from "@swmansion/smelter";
import type Smelter from "@swmansion/smelter-web-wasm";
import { COLORS } from "../../../../../styles/colors";
import SmelterVideoOutput from "../../smelter-utils/SmelterVideoOutput";
import CameraContent from "./CameraContent";
import { useLabelStore } from "./TextInput";

export const OUTPUT_SIZE = { width: 480, height: 270 };

type OutputProps = {
  smelter: Smelter;
};

export default function Output({ smelter }: OutputProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <SmelterVideoOutput
        smelter={smelter}
        muted
        controls
        width={OUTPUT_SIZE.width}
        height={OUTPUT_SIZE.height}>
        <OutputContent />
      </SmelterVideoOutput>
      <h3 className="text-demos-subheader">Composed live stream or video</h3>
    </div>
  );
}

function OutputContent() {
  const { labelTextContent, backgroundColor, labelColor } = useLabelStore();

  return (
    <View
      style={{
        borderRadius: 16,
        borderColor: COLORS.white100,
        borderWidth: 1.5,
      }}>
      <Rescaler>
        <InputStream id="stream" inputId="stream" />
      </Rescaler>
      <CameraContent />
      <View
        style={{
          top: 0,
          width: OUTPUT_SIZE.width / 2,
          right: 0,
          paddingTop: 16,
          paddingRight: 20,
        }}>
        <View />
        <Text
          style={{
            fontSize: 18,
            lineHeight: 21,
            color: labelColor,
            backgroundColor: backgroundColor,
            fontWeight: "bold",
            wrap: "word",
            maxWidth: OUTPUT_SIZE.width / 2,
            maxHeight: OUTPUT_SIZE.height,
          }}>
          {labelTextContent}
        </Text>
      </View>
    </View>
  );
}
