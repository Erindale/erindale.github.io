document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
  
    banner.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;
  
      banner.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    });
  });
  