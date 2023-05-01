document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner");
  const bannerBg = document.querySelector(".banner-bg");
  const canvas = document.getElementById("depth-map");
  const ctx = canvas.getContext("2d");
  const links = document.querySelectorAll(".link");

  const mainImage = new Image();
  mainImage.src = "images/erindale_rope_bridge_banner.webp";

  const depthImage = new Image();
  depthImage.src = "images/erindale_rope_bridge_banner_depth.webp";

  depthImage.onload = () => {
    canvas.width = depthImage.width;
    canvas.height = depthImage.height;
    ctx.drawImage(depthImage, 0, 0);
  };

  const getDepth = (x, y) => {
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    return (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
  };

  const updateParallax = (offsetX, offsetY) => {
    const depthMultiplier = 5; // Adjust the multiplier to control the parallax effect strength

    bannerBg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    mainImage.style.left = `${offsetX}px`;
    mainImage.style.top = `${offsetY}px`;

    for (let y = 0; y < depthImage.height; y++) {
      for (let x = 0; x < depthImage.width; x++) {
        const depth = getDepth(x, y) / 255;
        const xPos = x + offsetX * depth * depthMultiplier;
        const yPos = y + offsetY * depth * depthMultiplier;
        ctx.drawImage(mainImage, x, y, 1, 1, xPos, yPos, 1, 1);
      }
    }
  };

  banner.addEventListener("mousemove", (e) => {
    const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
    const offsetY = (window.innerHeight / 2 - e.pageY) / 25;

    updateParallax(offsetX, offsetY);
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
  