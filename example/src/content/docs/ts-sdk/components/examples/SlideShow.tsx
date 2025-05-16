import {
  Mp4,
  Rescaler,
  Slide,
  SlideShow,
  Text,
  View,
} from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <View style={{ backgroundColor: "#52505b" }}>
      <Rescaler>
        <SlideShow>
          <Slide durationMs={5000}>
            <Text>Text visible for 5 seconds</Text>
          </Slide>
          <Slide>
            <Mp4 source="https://example.com/video.mp4" />
          </Slide>
          <Slide durationMs={5000}>
            <Text>
              Text visible after entire mp4 file finished playing.
            </Text>
          </Slide>
        </SlideShow>
      </Rescaler>
    </View>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  await smelter.registerOutput("output", <ExampleApp />, {
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
  });

  await smelter.start();
}
void run();
