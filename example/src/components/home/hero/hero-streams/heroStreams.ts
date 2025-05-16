function hexToRgb(hex: string) {
  // Remove the hash at the front, if there
  let processedHex = hex.replace(/^\s*#|\s*$/g, "");

  // Parse the digits
  if (processedHex.length === 3) {
    processedHex = hex.replace(/(.)/g, "$1$1"); // Convert shorthand form (e.g., "abc") to full form ("aabbcc")
  }

  const bigint = Number.parseInt(processedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

document.addEventListener("astro:page-load", () => {
  const snapInThreshold = 220;
  const snapOutThreshold = 220;
  const opacityThreshold = 450;

  const streamLayers = document.querySelectorAll<HTMLElement>("#heroStreams > svg");
  const descriptionLayer = document.querySelectorAll<HTMLElement>("#descriptionLayer")[0];
  const descriptionLayerRect = descriptionLayer?.getBoundingClientRect();

  if (!streamLayers[0]) return;
  const { left, top, width, height } = streamLayers[0].getBoundingClientRect();

  const videoLayer = document.querySelectorAll<HTMLElement>("#videoLayer")[0];
  const videoLayerRect = videoLayer.getBoundingClientRect();

  const streamerLayer = document.querySelectorAll<HTMLElement>("#streamerLayer")[0];

  videoLayer.animate(
    [
      {
        transform: `translate(${left - videoLayerRect.left + 16}px, ${top - videoLayerRect.top + 16}px)`,
      },
    ],
    {
      duration: 100,
      fill: "forwards",
      easing: "linear",
      composite: "replace",
    }
  );

  const streamLayerRects: Array<DOMRect> = [];

  for (const layer of streamLayers) {
    streamLayerRects.push(layer.getBoundingClientRect());
  }

  const containerRect = document.querySelector("#heroStreams")?.getBoundingClientRect();
  const opacityLayers = document.querySelectorAll("#opacity_layer");

  if (!containerRect) return;

  function positionAndFadeInLayers() {
    let transitionCompletedCount = 0;

    streamLayers.forEach((layer, index) => {
      const modifiedIndex = index + 0.3;
      const entryAnimation = layer.animate(
        [
          { opacity: 0.1 },
          {
            opacity: 1,
            offset: 0.7,
            transform: `translate(-${modifiedIndex * 5}rem, ${2 * modifiedIndex}rem)`,
          },
          { opacity: 1, transform: `translate(-${modifiedIndex * 5}rem, ${2 * modifiedIndex}rem)` },
        ],
        {
          duration: 600,
          delay: 200 + 400 * (index + 1),
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      entryAnimation.onfinish = () => {
        transitionCompletedCount++;
        if (transitionCompletedCount === streamLayers.length) {
          // All layers are faded in, proceed to set up layer movements
          setupLayersMovement();
        }
      };
    });
  }

  positionAndFadeInLayers();

  const bottomLayerMidX = left + width / 2;
  const bottomLayerMidY = top + height / 2;

  function moveLayers({ clientX, clientY }: MouseEvent) {
    if (window.scrollY + clientY > window.innerHeight) return;

    requestAnimationFrame(() => {
      for (let index = 0; index < streamLayers.length; index++) {
        const factor = (0.45 * (index + 1)) / 3;
        const layerOffset = {
          x: (clientX - bottomLayerMidX) * factor,
          y: (clientY - bottomLayerMidY) * factor,
        };

        const distanceToBottomLayerCenter = Math.sqrt(
          (clientX - bottomLayerMidX) ** 2 + (clientY - bottomLayerMidY) ** 2
        );

        const isOutsideHero = clientX < (descriptionLayerRect?.right || 0) * 0.85;
        const shouldSnapIn = distanceToBottomLayerCenter <= snapInThreshold;
        const shouldSnapOut = distanceToBottomLayerCenter >= snapOutThreshold;

        if (isOutsideHero) return;
        if (shouldSnapIn) {
          streamLayers[index].animate(
            [
              {
                transform: `translate(${left - streamLayerRects[index].left}px, ${top - streamLayerRects[index].top}px)`,
              },
            ],
            {
              duration: 1000,
              fill: "forwards",
              easing: "linear",
              composite: "replace",
            }
          );

          videoLayer.animate(
            [
              {
                opacity: 1,
              },
            ],
            {
              delay: 200,
              duration: 2000,
              fill: "forwards",
              easing: "ease-in-out",
              composite: "replace",
            }
          );

          streamerLayer.animate(
            [
              {
                opacity: 1,
              },
            ],
            {
              duration: 2000,
              fill: "forwards",
              easing: "linear",
              composite: "replace",
            }
          );
        } else if (shouldSnapOut) {
          streamLayers[index].animate(
            [{ transform: `translate(${layerOffset.x}px, ${layerOffset.y}px)` }],
            {
              duration: 600,
              easing: "linear",
              fill: "forwards",
              composite: "replace",
            }
          );

          videoLayer.animate(
            [
              {
                opacity: 0,
              },
            ],
            {
              duration: 100,
              fill: "forwards",
              easing: "ease-in",
              composite: "replace",
            }
          );

          streamerLayer.animate(
            [
              {
                opacity: 0,
              },
            ],
            {
              duration: 100,
              fill: "forwards",
              easing: "ease-in",
              composite: "replace",
            }
          );
        }
      }
    });
  }

  function handleOpacity({ clientX, clientY }: MouseEvent) {
    if (window.scrollY + clientY > window.innerHeight) return;

    requestAnimationFrame(() => {
      const bottomLayerRect = streamLayers[0].getBoundingClientRect();
      const bottomLayerMidX = bottomLayerRect.left + bottomLayerRect.width / 2;
      const bottomLayerMidY = bottomLayerRect.top + bottomLayerRect.height / 2;

      // Calculate the deltas based on the difference between the cursor and the exact center of the container
      let dx = clientX - bottomLayerMidX;
      let dy = clientY - bottomLayerMidY;

      // Calculate the distance from the cursor to the bottom layer's center.
      const distanceToBottomLayerCenter = Math.sqrt(
        (clientX - bottomLayerMidX) ** 2 + (clientY - bottomLayerMidY) ** 2
      );

      for (const layer of opacityLayers) {
        const layerRect = layer.getBoundingClientRect();

        dx = bottomLayerRect.left - layerRect.left;
        dy = bottomLayerRect.top - layerRect.top;
        const newOpacity = Math.max(
          Math.min(distanceToBottomLayerCenter / opacityThreshold - 0.2, 0.75),
          0
        );

        layer.animate([{ fillOpacity: newOpacity }], {
          duration: 200,
          fill: "forwards",
          easing: "ease-in-out",
          composite: "replace",
        });
      }
    });
  }

  function setupLayersMovement() {
    window.addEventListener("mousemove", moveLayers);
    document.addEventListener("mousemove", handleOpacity);
  }
});
