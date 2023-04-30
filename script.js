document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    const bannerBg = document.querySelector(".banner-bg");
    const links = document.querySelectorAll(".link");
  
    banner.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;
  
      bannerBg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
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
  