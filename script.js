document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner");
  const bannerBg = document.querySelector(".banner-bg");
  const depthMap = document.querySelector(".depth-map");
  const links = document.querySelectorAll(".link");

  banner.addEventListener("mousemove", (e) => {
    const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
    const offsetY = (window.innerHeight / 2 - e.pageY) / 25;
    const depthOffsetX = offsetX * 2; // Adjust the multiplier to control the parallax effect strength
    const depthOffsetY = offsetY * 2; // Adjust the multiplier to control the parallax effect strength

    bannerBg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    depthMap.style.backgroundPosition = `${depthOffsetX}px ${depthOffsetY}px`;
  });
  
    links.forEach((link) => {
      link.addEventListener("mouseover", () => {
        banner.classList.add("blur-banner");
        bannerBg.classList.add("dim-banner");
      });
  
      link.addEventListener("mouseout", () => {
        banner.classList.remove("blur-banner");
        bannerBg.classList.remove("dim-banner");
      });
    });
  });
  