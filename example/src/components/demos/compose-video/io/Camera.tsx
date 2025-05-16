import { InputStream, Rescaler } from "@swmansion/smelter";
import type Smelter from "@swmansion/smelter-web-wasm";
import { useEffect, useState } from "react";

import { create } from "zustand";
import SmelterCanvasOutput from "../../smelter-utils/SmelterCanvasOutput";
import { INPUT_SIZE } from "./Stream";

type CameraStore = {
  cameraInputsCount: number;
  setCameraInputsCount: (counter: number) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
  cameraInputsCount: 0,
  setCameraInputsCount: (counter) => set({ cameraInputsCount: counter }),
}));

type CameraProps = {
  smelter?: Smelter;
};

export default function Camera({ smelter }: CameraProps) {
  const { cameraInputsCount, setCameraInputsCount } = useCameraStore();

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const cameraStatus = await navigator.permissions.query({ name: "camera" });

        const isDenied = cameraStatus.state === "denied";

        const handleUpdate = async () => {
          const cameraStatus = await navigator.permissions.query({ name: "camera" });

          const isDenied = cameraStatus.state === "denied";
          setCameraPermissionDenied(isDenied);
        };

        cameraStatus.onchange = handleUpdate;
        setCameraPermissionDenied(isDenied);
      } catch (error) {
        console.error("Error checking camera permissions:", error);
        setCameraPermissionDenied(false);
      }
    };

    checkCameraPermission();
  }, []);

  const handleIncrease = () => {
    setCameraInputsCount(cameraInputsCount + 1);
  };

  const handleDecrease = () => {
    setCameraInputsCount(Math.max(0, cameraInputsCount - 1));
  };

  const handleCameraPermissionRequest = async () => {
    try {
      setIsCameraReady(true);
      setCameraInputsCount(1);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { max: 400 },
          height: { max: 400 },
        },
      });
      await smelter?.registerInput("camera", { type: "stream", stream });
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  if (!smelter) {
    return <div className="bg-demos-background" style={{ ...INPUT_SIZE }} />;
  }

  return (
    <div className="relative bg-demos-background">
      {isCameraReady ? (
        <SmelterCanvasOutput smelter={smelter} width={INPUT_SIZE.width} height={INPUT_SIZE.height}>
          <Rescaler
            style={{
              borderRadius: 16,
              borderColor: "white",
              borderWidth: 1.5,
              rescaleMode: "fill",
            }}>
            <InputStream inputId="camera" />
          </Rescaler>
        </SmelterCanvasOutput>
      ) : (
        <>
          <div
            style={{ ...INPUT_SIZE }}
            className="flex items-center justify-center rounded-2xl border border-demos-border border-solid p-4">
            {cameraPermissionDenied ? (
              <p className="mt-2 text-center text-demos-subheader">
                Camera access has been denied. Update your permissions to enable the toggle.
              </p>
            ) : (
              <button
                type="button"
                className="rounded bg-demos-button px-4 py-2 text-demos-buttonText shadow"
                onClick={handleCameraPermissionRequest}>
                Toggle camera
              </button>
            )}
          </div>
        </>
      )}
      <div className="-right-12 absolute top-0 mb-4 flex flex-col items-center justify-center">
        <button
          type="button"
          className="rounded bg-demos-button px-4 py-2 text-demos-buttonText shadow"
          onClick={handleIncrease}>
          +
        </button>
        <span className="py-2 text-white">{cameraInputsCount}</span>
        <button
          type="button"
          className="rounded bg-demos-button px-4 py-2 text-demos-buttonText shadow"
          onClick={handleDecrease}>
          -
        </button>
      </div>
    </div>
  );
}
