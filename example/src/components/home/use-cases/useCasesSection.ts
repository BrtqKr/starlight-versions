type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

document.addEventListener("astro:page-load", () => {
  const useCasesHeader = document.getElementById("useCasesHeader");

  function adjustHeaderMargin() {
    if (!useCasesHeader) return;

    const headerHeight = useCasesHeader.getBoundingClientRect().height;
    const mediaQuery = window.innerWidth > 640;

    if (mediaQuery) {
      useCasesHeader.style.marginBottom = `-${headerHeight + 32}px`;
    } else {
      return;
    }
  }

  // Call on initial load
  adjustHeaderMargin();

  // Add event listener to re-calculate when window is resized
  window.addEventListener("resize", adjustHeaderMargin);

  const tiles = document.querySelectorAll("#useCaseTile");
  let tileBorderDivs: Array<HTMLDivElement> = [];

  for (const tile of tiles) {
    const children = Array.from(tile.querySelectorAll(":scope > div"));
    tileBorderDivs = tileBorderDivs.concat(children as Array<HTMLDivElement>);
  }

  function interpolateColor(color1: Color, color2: Color, factor: number) {
    return {
      r: Math.round(color1.r + factor * (color2.r - color1.r)),
      g: Math.round(color1.g + factor * (color2.g - color1.g)),
      b: Math.round(color1.b + factor * (color2.b - color1.b)),
      a: Math.round(color1.a + factor * (color2.a - color1.a)),
    };
  }

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const stickyTopOffset = 112;

    tileBorderDivs.forEach((el, index) => {
      const gradient = el.querySelector<HTMLDivElement>("#gradient");

      const rect = el.getBoundingClientRect();
      const buffer = rect.height; // Buffer range above and below the offset for the gradient effect
      const gradientBuffer = 120;

      const elTopPosition = scrollTop + rect.top;

      const distance = Math.abs(stickyTopOffset + scrollTop - elTopPosition);
      let scrollPercentage = 0;
      let gradientScrollPercentage = 0;

      if (distance > buffer) {
        scrollPercentage = 0;
      } else {
        scrollPercentage = 1 - distance / buffer;
      }

      if (distance > gradientBuffer) {
        gradientScrollPercentage = 0;
      } else {
        gradientScrollPercentage = 1 - distance / gradientBuffer;
      }

      if (index < tileBorderDivs.length - 1) {
        const nextEl = tileBorderDivs[index + 1];
        const nextRect = nextEl.getBoundingClientRect();
        const nextElTopPosition = scrollTop + nextRect.top;
        const nextDistance = Math.abs(stickyTopOffset + scrollTop - nextElTopPosition);
        let nextScrollPercentage = 0;
        // let nextGradientScrollPercentage;

        if (nextDistance > buffer) {
          nextScrollPercentage = 0;
          // nextGradientScrollPercentage = 0;
        } else {
          nextScrollPercentage = 1 - nextDistance / buffer;
          // nextGradientScrollPercentage = 1 - (nextDistance / gradientBuffer)
        }

        scrollPercentage *= 1 - nextScrollPercentage;
        gradientScrollPercentage *= 1 - nextScrollPercentage;
      }

      const startColorEnabled = { r: 251, g: 198, b: 207, a: 255 };
      const endColorEnabled = { r: 22, g: 17, b: 39, a: 255 };
      const colorDisabled = { r: 255, g: 255, b: 255, a: 64 };

      const startColor = interpolateColor(colorDisabled, startColorEnabled, scrollPercentage);
      const endColor = interpolateColor(colorDisabled, endColorEnabled, scrollPercentage);

      el.style.setProperty("--start-r", startColor.r.toString());
      el.style.setProperty("--start-g", startColor.g.toString());
      el.style.setProperty("--start-b", startColor.b.toString());
      el.style.setProperty("--start-a", (startColor.a / 255).toString());

      el.style.setProperty("--end-r", endColor.r.toString());
      el.style.setProperty("--end-g", endColor.g.toString());
      el.style.setProperty("--end-b", endColor.b.toString());
      el.style.setProperty("--end-a", (endColor.a / 255).toString());

      gradient?.style.setProperty("--start-ratio", "0");
      gradient?.style.setProperty("--end-ratio", `${(gradientScrollPercentage * 100) / 2}%`);
    });
  }
  onScroll();
  window.addEventListener("scroll", onScroll);
});
