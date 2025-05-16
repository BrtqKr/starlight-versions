import { Image, InputStream, Rescaler, View } from "@swmansion/smelter";
import { COLORS } from "../../../../../styles/colors";
import { useUserSettingsStore } from "../settings/UsersSettingsSection";
import { OUTPUT_SIZE } from "./Output";

type UserTileProps = {
  index: number;
  iconSize: number;
};

export default function UserTile({ index, iconSize }: UserTileProps) {
  const { isCameraActive, usersMuted } = useUserSettingsStore();

  const mutedStyle = {
    width: iconSize,
    height: iconSize,
  };

  return (
    <View style={{ ...OUTPUT_SIZE }}>
      <Rescaler
        style={{
          borderRadius: 12,
          borderColor: COLORS.white100,
          borderWidth: 1.5,
          rescaleMode: "fill",
        }}>
        <InputStream
          id={`camera${index}`}
          inputId={isCameraActive && index === 0 ? "camera" : `participant${(index % 3) + 1}`}
        />
      </Rescaler>
      {usersMuted[index] && (
        <Rescaler style={{ top: 12, right: 12, ...mutedStyle }}>
          <Image imageId="muted" />
        </Rescaler>
      )}
    </View>
  );
}
