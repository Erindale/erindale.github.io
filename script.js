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

  let depthData = null;

  const loadImageToCanvas = (image) => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    depthData = ctx.getImageData(0, 0, image.width, image.height).data;
  };

  depthImage.onload = () => {
    loadImageToCanvas(depthImage);
  };

  const getDepth = (x, y, width) => {
    const idx = (y * width + x) * 4;
    return (depthData[idx] + depthData[idx + 1] + depthData[idx + 2]) / 3;
  };

  const updateParallax = (offsetX, offsetY) => {
    const depthMultiplier = 0.5; // Adjust the multiplier to control the parallax effect strength

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mainImage, offsetX, offsetY);

    for (let y = 1; y < canvas.height; y++) {
      for (let x = 1; x < canvas.width; x++) {
        const depth = getDepth(x, y, canvas.width) / 255;
        const dx = offsetX * depth * depthMultiplier;
        const dy = offsetY * depth * depthMultiplier;

        ctx.drawImage(mainImage, x + dx, y + dy, 1, 1, x, y, 1, 1);
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
  