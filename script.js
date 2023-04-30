document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    const bannerBg = document.querySelector(".banner-bg");
    const links = document.querySelectorAll(".link");
  
    links.forEach((link) => {
      link.addEventListener("mouseover", () => {
        banner.classList.add("blur-banner", "dim-banner");
      });
  
      link.addEventListener("mouseout", () => {
        banner.classList.remove("blur-banner", "dim-banner");
      });
    });
  });
  