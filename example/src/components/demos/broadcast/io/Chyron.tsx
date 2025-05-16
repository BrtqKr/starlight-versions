import { Text, View } from "@swmansion/smelter";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { COLORS } from "../../../../../styles/colors";

type ChyronStore = {
  chyronContent: string;
  labelColor: string;
  backgroundColor: string;
  setChyronContent: (chyronContent: string) => void;
  setLabelColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
};

export const useChyronStore = create<ChyronStore>((set) => ({
  chyronContent:
    "Smelter is a toolkit for video composition\nYou can use it to seamlessly build applications such as this one\nConfigure output video using React components, or HTTP API\nSmelter is free to use excluding some enterprise-scale business applications",
  labelColor: COLORS.white100.slice(0, 7),
  backgroundColor: COLORS.black75,
  setLabelColor: (color: string) => set({ labelColor: color }),
  setBackgroundColor: (color: string) => {
    set({ backgroundColor: `${color}BF` });
  },
  setChyronContent: (chyronContent: string) => set({ chyronContent }),
}));

export type ChyronProps = { messages: string[]; messageDurationMs: number };

export default function Chyron({ messages, messageDurationMs }: ChyronProps) {
  const { backgroundColor, labelColor } = useChyronStore();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) {
      return;
    }
    if (index >= messages.length) {
      setIndex(0);
    }
    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, messageDurationMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [messages, index, messageDurationMs]);

  const currentMessage = messages[index % messages.length];
  const nextMessage = messages[(index + 1) % messages.length];

  return (
    <View style={{ backgroundColor: backgroundColor }}>
      <ChyronText msg={currentMessage} color={labelColor} index={index} current />
      {nextMessage && <ChyronText msg={nextMessage} color={labelColor} index={index + 1} />}
    </View>
  );
}

function ChyronText(props: { msg: string; index: number; current?: boolean; color: string }) {
  return (
    <View
      id={String(props.index)}
      style={{ left: 0, top: props.current ? 8 : 56, paddingHorizontal: 24 }}
      transition={{
        durationMs: 500,
        easingFunction: { functionName: "cubic_bezier", points: [0.33, 1, 0.68, 1] },
      }}>
      <Text style={{ color: props.color, fontSize: 24 }}>{props.msg}</Text>
    </View>
  );
}
