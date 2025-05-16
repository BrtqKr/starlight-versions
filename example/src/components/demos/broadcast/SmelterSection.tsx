import { setWasmBundleUrl } from "@swmansion/smelter-web-wasm";
import { useEffect, useState } from "react";
import BroadcastMp4 from "../../../assets/demos/broadcast/broadcast.mp4";
import Edit from "../../../assets/demos/edit.svg";
import SmelterLogo from "../../../assets/demos/smelter-circle.svg";
import { isChromiumBased } from "../../../utils/browser";
import LoadingSpinner from "../../base/LoadingSpinner";
import { useSmelter } from "../smelter-utils/useSmelter";
import { useChyronStore } from "./io/Chyron";
import Output from "./io/Output";

setWasmBundleUrl("/smelter.wasm");

export default function SmelterSection() {
  const isChromium = isChromiumBased();
  const smelter = useSmelter();

  const [isReady, setIsReady] = useState(false);

  const {
    chyronContent,
    labelColor,
    backgroundColor,
    setChyronContent,
    setLabelColor,
    setBackgroundColor,
  } = useChyronStore();

  useEffect(() => {
    if (!smelter) {
      return;
    }

    void smelter?.registerInput("broadcast", { url: BroadcastMp4, type: "mp4" });

    const intervalBroadcast = setInterval(async () => {
      await smelter?.unregisterInput("broadcast").catch(() => {});
      await smelter?.registerInput("broadcast", { url: BroadcastMp4, type: "mp4" });
    }, 20000);

    return () => {
      clearInterval(intervalBroadcast);
    };
  }, [smelter]);

  useEffect(() => {
    const loadSvg = async () => {
      if (!smelter) return;
      await smelter.registerImage("smelter", {
        assetType: "svg",
        url: new URL(SmelterLogo.src, import.meta.url).toString(),
      });
      setIsReady(true);
    };
    loadSvg();
  }, [smelter]);

  if (isChromium === "loading") {
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

  return (
    <>
      <div>
        <h2 className="text-demos-header">News broadcast example</h2>
        <p className="text-demos-subheader">
          See how Smelter handles component transitions based on your input.
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full flex-col justify-center gap-6 sm:flex-row">
          <div className="flex flex-3">
            <div className="flex aspect-video w-full flex-col">
              {isReady && <Output smelter={smelter} />}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <textarea
              value={chyronContent}
              onChange={(e) => setChyronContent(e.target.value)}
              placeholder="Enter a chyron content"
              className="h-1/2 rounded-md border bg-demos-background p-4 text-demos-text shadow-sm focus:outline-none"
            />
            <div className="flex flex-row items-center gap-2">
              <div className="group relative flex flex-col items-center">
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded-md border border-demos-border"
                />
                <img
                  alt="edit"
                  src={Edit.src}
                  className="pointer-events-none absolute mt-2 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <p className="text-demos-text">Background color</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="group relative flex flex-col items-center">
                <input
                  type="color"
                  id="labelColor"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded-md border border-demos-border"
                />
                <img
                  alt="edit"
                  src={Edit.src}
                  className="pointer-events-none absolute mt-2 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <p className="text-demos-text">Text color</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
