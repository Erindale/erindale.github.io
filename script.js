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

  let fg, d, displacementFilter;

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

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 0;
    const brightnessFilter = new PIXI.filters.ColorMatrixFilter();
    brightnessFilter.brightness(1);
    fg.filters = [displacementFilter, blurFilter, brightnessFilter];

    animate(blurFilter, brightnessFilter);
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

  function animate(blurFilter, brightnessFilter) {
    let targetBlur = 0;
    let targetBrightness = 1;

    links.forEach((link) => {
      link.addEventListener("mouseover", () => {
        targetBlur = 10;
        targetBrightness = 0.8;
      });
      link.addEventListener("mouseout", () => {
        targetBlur = 0;
        targetBrightness = 1;
      });
    });

    let blurTween = new TWEEN.Tween(blurFilter)
      .to({ blur: targetBlur }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        blurFilter.blur = blurTween._object.blur;
      });

    let brightnessTween = new TWEEN.Tween(brightnessFilter)
      .to({ brightness: targetBrightness }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        brightnessFilter.brightness(brightnessTween._object.brightness);
      })

      function updateTweens() {
        blurTween.update();
        brightnessTween.update();
      }
      
      function loop() {
        updateTweens();
        renderer.render(stage);
        requestAnimationFrame(loop);
      }
      
      loop();
    }
  });