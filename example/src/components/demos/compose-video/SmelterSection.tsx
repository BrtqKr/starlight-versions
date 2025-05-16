import { setWasmBundleUrl } from "@swmansion/smelter-web-wasm";
import { useEffect } from "react";
import Arrow from "../../../assets/demos/arrow.svg";
import Arrows from "../../../assets/demos/arrows.svg";
import SmelterLogo from "../../../assets/navigation/smelter-logo-small.svg";
import CommercialMp4 from "../../../assets/race_640x360_full.mp4";
import { useSmelter } from "../smelter-utils/useSmelter";
import Camera from "./io/Camera";
import Output from "./io/Output";
import Stream from "./io/Stream";
import TextInput from "./io/TextInput";

setWasmBundleUrl("/smelter.wasm");

export default function SmelterSection() {
  const smelter = useSmelter();

  useEffect(() => {
    if (!smelter) {
      return;
    }

    void smelter?.registerInput("stream", { url: CommercialMp4, type: "mp4" });
    const interval = setInterval(async () => {
      await smelter?.unregisterInput("stream").catch(() => {});
      await smelter?.registerInput("stream", { url: CommercialMp4, type: "mp4" });
    }, 36000);

    return () => {
      clearInterval(interval);
    };
  }, [smelter]);

  return (
    <div className="relative flex items-center">
      <div className="flex flex-col gap-y-4">
        <Camera smelter={smelter} />
        <Stream smelter={smelter} />
        <TextInput />
      </div>
      <img alt="arrows" src={Arrows.src} className="-ml-12 -z-10 h-56" />
      <img alt="smelter" src={SmelterLogo.src} className="-z-10 ml-16 h-24" />
      <img alt="arrow" src={Arrow.src} className="-z-10 mr-4 ml-6 w-28" />
      {smelter && <Output smelter={smelter} />}
    </div>
  );
}
