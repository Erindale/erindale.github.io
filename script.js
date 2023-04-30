document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    const links = document.querySelectorAll(".link");
  
    banner.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;
  
      banner.style.setProperty('--gradient-x', `${e.clientX}px`);
      banner.style.setProperty('--gradient-y', `${e.clientY}px`);
      banner.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    });
  
    links.forEach((link) => {
      link.addEventListener("mouseover", () => {
        banner.classList.add("blur-banner");
        banner.style.setProperty('--gradient-opacity', 1);
      });
  
      link.addEventListener("mouseout", () => {
        banner.classList.remove("blur-banner");
        banner.style.setProperty('--gradient-opacity', 0);
      });
    });
  });
  