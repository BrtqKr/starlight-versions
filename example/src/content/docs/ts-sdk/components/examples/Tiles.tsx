import {
  InputStream,
  Rescaler,
  Tiles,
  useInputStreams,
} from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  const inputs = useInputStreams();

  return (
    <Tiles transition={{ durationMs: 200 }}>
      {Object.values(inputs).map((input) => (
        <Rescaler key={input.inputId} style={{ rescaleMode: "fill" }}>
          <InputStream inputId={input.inputId} />
        </Rescaler>
      ))}
    </Tiles>
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
    audio: {
      encoder: {
        type: "aac",
        channels: "stereo",
      },
    },
  });

  await smelter.start();

  await smelter.registerInput("input_1", {
    type: "mp4",
    serverPath: "./inputExample1.mp4",
  });

  await smelter.registerInput("input_2", {
    type: "mp4",
    serverPath: "./inputExample2.mp4",
  });

  await new Promise<void>((res) => {
    setTimeout(() => res(), 3000);
  });
  await smelter.registerInput("input_3", {
    type: "mp4",
    serverPath: "./inputExample3.mp4",
  });

  await new Promise<void>((res) => {
    setTimeout(() => res(), 3000);
  });
  await smelter.registerInput("input_4", {
    type: "mp4",
    serverPath: "./inputExample4.mp4",
  });
  await smelter.registerInput("input_5", {
    type: "mp4",
    serverPath: "./inputExample5.mp4",
  });

  await new Promise<void>((res) => {
    setTimeout(() => res(), 3000);
  });
  await smelter.unregisterInput("input_2");

  await new Promise<void>((res) => {
    setTimeout(() => res(), 3000);
  });
  await smelter.unregisterInput("input_3");
}
void run();
