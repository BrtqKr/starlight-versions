import { Text, View, useBlockingTask } from "@swmansion/smelter";
import { OfflineSmelter } from "@swmansion/smelter-node";

async function sleep(durationMs: number): Promise<void> {
  return new Promise<void>((res) => {
    setTimeout(() => res(), durationMs);
  });
}

function ExampleApp() {
  const result = useBlockingTask(async () => {
    await sleep(1000);
    return "Task result";
  });

  return (
    <View>
      <Text>{result}</Text>
    </View>
  );
}

async function run() {
  const smelter = new OfflineSmelter();
  await smelter.init();
  await smelter.render(<ExampleApp />, {
    type: "mp4",
    serverPath: "./output.mp4",
    video: {
      encoder: {
        type: "ffmpeg_h264",
        preset: "ultrafast",
      },
      resolution: {
        width: 1920,
        height: 1080,
      },
    },
    audio: {
      encoder: {
        type: "aac",
        channels: "stereo",
      },
    },
  });
}
void run();
