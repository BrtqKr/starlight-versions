import type Smelter from "@swmansion/smelter-web-wasm";

import { Tiles, View } from "@swmansion/smelter";
import { COLORS } from "../../../../../styles/colors";
import SmelterVideoOutput from "../../smelter-utils/SmelterVideoOutput";
import { useUserSettingsStore } from "../settings/UsersSettingsSection";
import UserTile from "./UserTile";

export const OUTPUT_SIZE = { width: 1270 * 1.5, height: 720 * 1.5 };

type OutputProps = {
  smelter: Smelter;
};

export default function Output({ smelter }: OutputProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <SmelterVideoOutput
        smelter={smelter}
        width={OUTPUT_SIZE.width + 3}
        height={OUTPUT_SIZE.height + 3}>
        <OutputContent />
      </SmelterVideoOutput>
    </div>
  );
}

function OutputContent() {
  const { usersCount } = useUserSettingsStore();
  const viewStyle =
    usersCount === 1
      ? {
          borderWidth: 0,
        }
      : {
          borderWidth: 1.5,
        };

  const tilesStyle =
    usersCount === 1
      ? {
          margin: 0,
        }
      : {
          margin: 12,
        };

  const usersCountFactor = 1 + Math.floor((usersCount - 1) / 4) * 0.25;

  return (
    <View
      style={{
        borderRadius: 12,
        borderColor: COLORS.white100,
        ...viewStyle,
      }}>
      <Tiles
        transition={{ durationMs: 200 }}
        style={{
          horizontalAlign: "center",
          verticalAlign: "center",
          width: OUTPUT_SIZE.width,
          height: OUTPUT_SIZE.height,
          ...tilesStyle,
        }}>
        {Array.from({ length: usersCount }, (_item, index) => (
          <UserTile key={`${_item}`} index={index} iconSize={64 / usersCountFactor} />
        ))}
      </Tiles>
    </View>
  );
}
