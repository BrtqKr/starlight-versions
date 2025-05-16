import {
  InputStream,
  Text,
  Tiles,
  useInputStreams,
} from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

type InputTileProps = {
  inputId: string;
  state?: "ready" | "playing" | "finished";
};

function InputTile({ inputId, state }: InputTileProps) {
  if (state === "finished") {
    return <Text style={{ fontSize: 40 }}>Stream {inputId} finished</Text>;
  }
  if (state === "playing") {
    return <InputStream inputId={inputId} />;
  }
  return (
    <Text style={{ fontSize: 40 }}>
      Waiting for stream {inputId} to connect
    </Text>
  );
}

function ExampleApp() {
  const inputs = useInputStreams();
  return (
    <Tiles transition={{ durationMs: 200 }}>
      {Object.values(inputs).map((input) => (
        <InputTile
          key={input.inputId}
          inputId={input.inputId}
          state={input.videoState}
        />
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

  await smelter.registerInput("input_1", {
    type: "mp4",
    serverPath: "./inputExample1.mp4",
  });

  await smelter.registerInput("input_2", {
    type: "mp4",
    serverPath: "./inputExample2.mp4",
  });

  await smelter.start();
}
void run();
