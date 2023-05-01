let fg;

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

  pixiContainer.appendChild(renderer.view);

  let d, displacementFilter;
  let scale;

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

    // Calculate the scale factor once and reuse it on subsequent resize events
    scale = Math.max(w / fg.texture.width, h / fg.texture.height);
    fg.width = fg.texture.width * scale;
    fg.height = fg.texture.height * scale;
    d.width = d.texture.width * scale;
    d.height = d.texture.height * scale;

    window.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;

      displacementFilter.scale.x = offsetX;
      displacementFilter.scale.y = offsetY;
    });

    animate();
  }

  window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;

    // Reuse the scale factor calculated in startMagic()
    fg.width = fg.texture.width * scale;
    fg.height = fg.texture.height * scale;
    d.width = d.texture.width * scale;
    d.height = d.texture.height * scale;

    renderer.resize(w, h);
  });

  function easeFilter(filter, property, method, targetValue, speed) {
    if (property) {
      const newValue = filter[property] + (targetValue - filter[property]) * speed;
      filter[property] = newValue;
    } else if (method) {
      const currentValue = filter[method](null);
      const newValue = currentValue + (targetValue - currentValue) * speed;
      filter[method](newValue);
    }
  }

  let targetBlur = 0;
  let targetBrightness = 1;

  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.blur = 0;
  const brightnessFilter = new PIXI.filters.ColorMatrixFilter();
  brightnessFilter.brightness(1);
  fg.filters = [displacementFilter, blurFilter, brightnessFilter];
  
  function animate() {
  d.renderable = false;
  easeFilter(blurFilter, 'blur', null, targetBlur, 0.1);
  easeFilter(brightnessFilter, null, 'brightness', targetBrightness, 0.1);

  renderer.render(stage);
  requestAnimationFrame(animate);
  }

  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      fg.filters = [displacementFilter, blurFilter, brightnessFilter];
      targetBlur = 10;
      targetBrightness = 0.8;
    });
    link.addEventListener("mouseout", () => {
      fg.filters = [displacementFilter]
      targetBlur = 0;
      targetBrightness = 1;
    });
  });
});