document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner");
  const pixiContainer = document.getElementById("pixi-container");
  const links = document.querySelectorAll(".link");
  const bannerBg = document.querySelector(".banner-bg");

  let w = window.innerWidth;
  let h = window.innerHeight;
  const renderer = new PIXI.WebGLRenderer(w, h, {
    transparent: true,
  });

  window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;
  
    const scale = Math.max(w / fg.texture.width, h / fg.texture.height);
  
    fg.width = fg.texture.width * scale;
    fg.height = fg.texture.height * scale;
    d.width = d.texture.width * scale;
    d.height = d.texture.height * scale;
  
    renderer.resize(w, h);
  });

  pixiContainer.appendChild(renderer.view);

  const stage = new PIXI.Container();
  const container = new PIXI.Container();
  const foreground = new PIXI.Container();
  stage.addChild(container);
  stage.addChild(foreground);

  const ploader = new PIXI.loaders.Loader();
  ploader.add("fg", "images/erindale_rope_bridge_banner.webp");
  ploader.add("depth", "images/erindale_rope_bridge_banner_depth.webp");

  ploader.once("complete", startMagic);
  ploader.load();

  let fg, d, displacementFilter;

  function startMagic() {
    fg = new PIXI.Sprite(ploader.resources.fg.texture);
    fg.width = w;
    fg.height = h;
    foreground.addChild(fg);

    d = new PIXI.Sprite(ploader.resources.depth.texture);
    d.width = w;
    d.height = h;
    container.addChild(d); // Add depth map to the container instead of the foreground
    displacementFilter = new PIXI.filters.DisplacementFilter(d, 0);

    window.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;

      displacementFilter.scale.x = offsetX;
      displacementFilter.scale.y = offsetY;
    });

    animate();
  }


  function animate() {
    d.renderable = false;

    renderer.render(stage);
    requestAnimationFrame(animate);
  }

  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.blur = 0;
  const brightnessFilter = new PIXI.filters.ColorMatrixFilter();
  brightnessFilter.brightness(1);
  fg.filters = [displacementFilter, blurFilter, brightnessFilter];
  
  
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      blurFilter.blur = 10;
      brightnessFilter.brightness(0.8);
    });
  
    link.addEventListener("mouseout", () => {
      blurFilter.blur = 0;
      brightnessFilter.brightness(1);
    });
  });
});
