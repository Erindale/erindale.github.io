document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    const bannerBg = document.querySelector(".banner-bg");
    const links = document.querySelectorAll(".link");
  
    banner.addEventListener("mousemove", (e) => {
        const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
        const offsetY = (window.innerHeight / 2 - e.pageY) / 25;
        const rect = banner.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
      
        bannerBg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
        banner.style.setProperty('--gradient-x', `${relX}px`);
        banner.style.setProperty('--gradient-y', `${relY}px`);
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
  