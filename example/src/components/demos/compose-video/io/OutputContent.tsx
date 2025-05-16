import { InputStream, Rescaler, Text, View } from "@swmansion/smelter";
import { COLORS } from "../../../../../styles/colors";
import CameraContent from "./CameraContent";
import { OUTPUT_SIZE } from "./Output";
import { useLabelStore } from "./TextInput";

export default function OutputContent() {
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
