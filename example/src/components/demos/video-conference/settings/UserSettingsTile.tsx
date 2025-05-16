import VoiceOff from "../../../../assets/demos/voice-off.svg";
import VoiceOn from "../../../../assets/demos/voice-on.svg";
import { useUserSettingsStore } from "./UsersSettingsSection";

export default function UserSettingsTile({ id }: { id: string }) {
  const { usersMuted, toggleUserMute } = useUserSettingsStore();
  const isMuted = usersMuted[id] || false;

  return (
    <div className="mb-2 flex h-12 w-full items-center justify-between rounded-md bg-demos-userSettingsTileBackground px-4 py-2">
      <span className="text-demos-text">User {id}</span>
      <button
        type="button"
        onClick={() => toggleUserMute(id)}
        className="rounded-full p-2 pl-4 text-white focus:outline-none">
        {isMuted ? (
          <img alt="voice on" src={VoiceOn.src} className="flex h-[25px] w-[25px] items-center" />
        ) : (
          <img alt="voice off" src={VoiceOff.src} className="flex h-[25px] w-[25px] items-center" />
        )}
      </button>
    </div>
  );
}
