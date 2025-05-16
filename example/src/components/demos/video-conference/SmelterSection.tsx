import Smelter from "@swmansion/smelter-web-wasm";
import { setWasmBundleUrl } from "@swmansion/smelter-web-wasm";
import { useEffect, useState } from "react";
import Participant1 from "../../../assets/demos/video-conference/conference-participant1.mp4";
import Participant2 from "../../../assets/demos/video-conference/conference-participant2.mp4";
import Participant3 from "../../../assets/demos/video-conference/conference-participant3.mp4";
import VoiceOffCircle from "../../../assets/demos/voice-off-circle.svg";

import { isChromiumBased } from "../../../utils/browser";
import LoadingSpinner from "../../base/LoadingSpinner";
import Output from "./io/Output";
import UserSettingsSection from "./settings/UsersSettingsSection";

setWasmBundleUrl("/smelter.wasm");

const CONFERENCE_PARTICIPANTS = [
  {
    id: "participant1",
    uri: Participant1,
  },
  {
    id: "participant2",
    uri: Participant2,
  },
  {
    id: "participant3",
    uri: Participant3,
  },
];

export default function SmelterSection() {
  const isChromium = isChromiumBased();

  const smelter = useSmelter();

  useEffect(() => {
    if (!smelter) {
      return;
    }

    CONFERENCE_PARTICIPANTS.map((participant) => {
      void smelter?.registerInput(participant.id, {
        url: participant.uri,
        type: "mp4",
      });
    });

    const intervalParticipants = setInterval(async () => {
      CONFERENCE_PARTICIPANTS.map(async (participant) => {
        await smelter?.unregisterInput(participant.id).catch(() => {});
        await smelter?.registerInput(participant.id, {
          url: participant.uri,
          type: "mp4",
        });
      });
    }, 10000);

    return () => {
      clearInterval(intervalParticipants);
    };
  }, [smelter]);

  useEffect(() => {
    const loadSvg = async () => {
      if (!smelter) return;
      await smelter.registerImage("muted", {
        assetType: "svg",
        url: new URL(VoiceOffCircle.src, import.meta.url).toString(),
      });
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
        <h2 className="text-demos-header">Video conference example</h2>
        <p className="text-demos-subheader">
          With Smelter, you can compose a video conference using ready-to-use React components.
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full shrink flex-col justify-center gap-6 sm:flex-row">
          <div className="flex flex-3">
            <div className="flex aspect-video w-full flex-col">
              {smelter && <Output smelter={smelter} />}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {smelter && <UserSettingsSection smelter={smelter} />}
          </div>
        </div>
      </div>
    </>
  );
}

function useSmelter(): Smelter | undefined {
  const [smelter, setSmelter] = useState<Smelter>();

  useEffect(() => {
    const smelter = new Smelter();

    let cancel = false;
    const promise = (async () => {
      await smelter.init();
      await smelter.start();
      if (!cancel) {
        setSmelter(smelter);
      }
    })();

    return () => {
      cancel = true;
      void (async () => {
        await promise.catch(() => {});
        await smelter.terminate();
      })();
    };
  }, []);
  return smelter;
}
