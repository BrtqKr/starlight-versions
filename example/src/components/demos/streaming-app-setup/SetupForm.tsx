import { navigate } from "astro:transitions/client";
import { type FormEvent, useRef } from "react";
import { isChromiumBased, isMobileBreakpoint } from "../../../utils/browser";
import LoadingSpinner from "../../base/LoadingSpinner";
import { useStreamStore } from "../streaming-app/LayoutsSection";

export default function SetupForm() {
  const isChromium = isChromiumBased();
  const isMobile = isMobileBreakpoint();

  const { setTwitchKey } = useStreamStore();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (formData.getAll("key")[0]) {
      setTwitchKey(formData.getAll("key")[0].toString());
    }
    navigate("/demos/streaming-app");
  }

  if (isChromium === "loading" || isMobile === "loading") {
    return <LoadingSpinner />;
  }

  if (isChromium === false) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center">
        <h3 className="mb-4 text-demos-header">Demos work only for Chromium-based browsers</h3>
        <p className="text-demos-subheader">Please switch to a supported browser to continue.</p>
      </div>
    );
  }

  if (isMobile === true) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center">
        <h3 className="mb-4 text-demos-header">This demo works only on desktop</h3>
        <p className="text-demos-subheader">Please switch to another device to continue.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <h2 className="text-demos-header">Streaming app example</h2>
        <p className="text-demos-subheader">
          Stream with custom layouts directly from Your Browser.
        </p>
      </div>
      <div className="flex flex-col space-y-4 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 py-4">
          <label htmlFor="key">
            <input
              ref={inputRef}
              type="password"
              id="key"
              name="key"
              placeholder="Enter a twitch key"
              className="w-[60%] rounded-md border bg-demos-background p-4 text-demos-inputLabel shadow-sm focus:outline-none"
            />
          </label>
          <div className="flex gap-x-4">
            <button
              type="submit"
              className="h-12 w-fit rounded-full bg-gradient-red-5 px-6 sm:px-7">
              <div className="flex items-center justify-center gap-x-3 text-white text-xl">
                <span>Continue</span>
              </div>
            </button>
            <button
              onClick={() => navigate("/demos/streaming-app")}
              type="button"
              className="gradient-light-5 h-12 w-fit rounded-full px-6 sm:px-7">
              <div className="flex items-center justify-center gap-x-3 text-white text-xl">
                <span>Continue without a key</span>
              </div>
            </button>
          </div>
        </form>
        <p className="text-demos-subheader">
          If you don't provide a key, the example will only be displayed on the site.
        </p>
      </div>
    </>
  );
}
