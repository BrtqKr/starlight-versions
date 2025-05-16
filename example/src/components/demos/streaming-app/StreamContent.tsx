import { InputStream, Rescaler, Text, View } from "@swmansion/smelter";
import { COLORS } from "../../../../styles/colors";
import { useStreamStore } from "./LayoutsSection";
import { useLabelStore } from "./StreamForm";
import { INPUT_SIZE } from "./StreamSection";
import StreamerWindow from "./StreamerWindow";
import Chat from "./chat/Chat";

export default function StreamContent() {
  const { currentLayout } = useStreamStore();
  const { labelColor, labelTextContent } = useLabelStore();

  if (currentLayout === "layout-streamer") {
    return (
      <View>
        <Rescaler
          style={{
            borderRadius: 16,
            borderColor: COLORS.white100,
            borderWidth: 1.5,
            rescaleMode: "fit",
          }}>
          <InputStream inputId="stream" />
        </Rescaler>

        <StreamerWindow />
      </View>
    );
  }

  if (currentLayout === "layout-chat")
    return (
      <View>
        <Rescaler
          style={{
            borderRadius: 16,
            borderColor: COLORS.white100,
            borderWidth: 1.5,
            rescaleMode: "fit",
          }}>
          <InputStream inputId="stream" />
        </Rescaler>
        <StreamerWindow />
        <Chat width={680} height={640} />
      </View>
    );

  if (currentLayout === "layout-message")
    return (
      <View>
        <Rescaler
          style={{
            borderRadius: 16,
            borderColor: COLORS.white100,
            borderWidth: 1.5,
            rescaleMode: "fit",
          }}>
          <InputStream inputId="stream" />
        </Rescaler>
        <StreamerWindow />
        <Chat width={680} height={640} />
        <View
          style={{
            top: 0,
            width: INPUT_SIZE.width / 2,
            right: 0,
            paddingTop: 16,
            paddingRight: 20,
          }}>
          <View />
          <Text
            style={{
              fontSize: 64,
              lineHeight: 68,
              fontWeight: "bold",
              wrap: "word",
              maxWidth: INPUT_SIZE.width / 2,
              maxHeight: INPUT_SIZE.height,
              color: labelColor,
            }}>
            {labelTextContent}
          </Text>
        </View>
      </View>
    );

  if (currentLayout === "layout-camera")
    return (
      <View>
        {
          <Rescaler
            style={{
              borderRadius: 16,
              borderColor: COLORS.white100,
              borderWidth: 1.5,
              rescaleMode: "fit",
            }}>
            <InputStream inputId="stream" />
          </Rescaler>
        }
        <StreamerWindow size="full" />
      </View>
    );
}
