import { setWasmBundleUrl } from "@swmansion/smelter-web-wasm";

import { useEffect } from "react";
import StreamerMp4 from "../../../assets/demos/streamer_640x360_full.mp4";
import RaceMp4 from "../../../assets/race_640x360_full.mp4";
import { isChromiumBased, isMobileBreakpoint } from "../../../utils/browser";
import LoadingSpinner from "../../base/LoadingSpinner";
import { useSmelter } from "../smelter-utils/useSmelter";
import LayoutsSection from "./LayoutsSection";
import Output from "./Output";
import StreamForm from "./StreamForm";

setWasmBundleUrl("/smelter.wasm");

export const INPUT_SIZE = { width: 1920, height: 1080 } as const;

export default function StreamSection() {
  const isChromium = isChromiumBased();
  const isMobile = isMobileBreakpoint();

  const smelter = useSmelter();

  useEffect(() => {
    if (!smelter) {
      return;
    }

    void smelter?.registerInput("stream", { url: RaceMp4, type: "mp4" });
    void smelter?.registerInput("streamer-placeholder", { url: StreamerMp4, type: "mp4" });

    const intervalStream = setInterval(async () => {
      await smelter?.unregisterInput("stream").catch(() => {});
      await smelter?.registerInput("stream", { url: RaceMp4, type: "mp4" });
    }, 18000);

    const intervalStreamerPalceholder = setInterval(async () => {
      await smelter?.unregisterInput("streamer-placeholder").catch(() => {});
      await smelter?.registerInput("streamer-placeholder", { url: StreamerMp4, type: "mp4" });
    }, 7000);

    return () => {
      clearInterval(intervalStream);
      clearInterval(intervalStreamerPalceholder);
    };
  }, [smelter]);

  if (isChromium === "loading" || isMobile === "loading") {
    return <LoadingSpinner />;
  }

  if (isChromium === false) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center">
        <h3 className="mb-4 text-demos-header">Demos work only on chromium-based browsers</h3>
        <p className="text-demos-subheader">Please switch to a supported browser to continue.</p>
      </div>
    );
  }

  if (isMobile === true) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center">
        <h3 className="mb-4 text-demos-header">This demo works only on desktop</h3>
        <p className="text-demos-subheader">
          Please switch to another device or breakpoint to continue.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <h2 className="text-demos-header">Streaming app example</h2>
        <p className="text-demos-subheader">
          Switch between different layouts and see how Smelter handles streaming directly from
          browser.
        </p>
      </div>
      <div className="flex w-full justify-center gap-x-6">
        <div className="flex flex-2.5">
          <div className="flex w-full flex-col">
            <Output smelter={smelter} />
            <StreamForm smelter={smelter} />
          </div>
        </div>
        <LayoutsSection />
      </div>
    </>
  );
}
