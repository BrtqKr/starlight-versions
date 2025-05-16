import type Smelter from "@swmansion/smelter-web-wasm";

import SmelterVideoOutput from "../smelter-utils/SmelterVideoOutput";
import SmelterWhipOutput from "../smelter-utils/SmelterWhipOutput";
import { useStreamStore } from "./LayoutsSection";
import StreamContent from "./StreamContent";

export const INPUT_SIZE = { width: 1920, height: 1080 } as const;

export default function Output({ smelter }: { smelter?: Smelter }) {
  const { twitchKey } = useStreamStore();

  if (!smelter) {
    return null;
  }

  if (twitchKey)
    return (
      <SmelterWhipOutput
        smelter={smelter}
        audio
        video={{ resolution: { width: INPUT_SIZE.width, height: INPUT_SIZE.height } }}
        endpointUrl="https://g.webrtc.live-video.net:4443/v2/offer"
        bearerToken={twitchKey}>
        <StreamContent />
      </SmelterWhipOutput>
    );

  return (
    <SmelterVideoOutput smelter={smelter} width={INPUT_SIZE.width} height={INPUT_SIZE.height}>
      <StreamContent />
    </SmelterVideoOutput>
  );
}
