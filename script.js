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

  let fg, d, displacementFilter, blurFilter, brightnessFilter;

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
    container.addChild(d);
    displacementFilter = new PIXI.filters.DisplacementFilter(d, 0);

    window.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;

      displacementFilter.scale.x = offsetX;
      displacementFilter.scale.y = offsetY;
    });

    blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 0;
    brightnessFilter = new PIXI.filters.ColorMatrixFilter();
    brightnessFilter.brightness(1);
    fg.filters = [displacementFilter, blurFilter, brightnessFilter];

    animate();
  }

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

  let targetBlur = 0;
  let targetBrightness = 1;
  
  function animate() {
    let blurTween = new TWEEN.Tween({ blur: blurFilter.blur })
      .to({ blur: targetBlur }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        blurFilter.blur = obj.blur;
      });
  
    let brightnessTween = new TWEEN.Tween({ brightness: brightnessFilter.brightness() })
      .to({ brightness: targetBrightness }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        brightnessFilter.brightness(obj.brightness);
      });
  
    function updateTweens() {
      TWEEN.update();
    }
  
    function loop() {
      updateTweens();
      renderer.render(stage);
      requestAnimationFrame(loop);
    }
  
    loop();
  }
  
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      targetBlur = 10;
      targetBrightness = 0.8;
      animate();
    });
    link.addEventListener("mouseout", () => {
      targetBlur = 0;
      targetBrightness = 1;
      animate();
    });
  });
  
})