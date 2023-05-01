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

  let fg, d, displacementFilter, blurFilter;
  let blackLayer;

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

    blackLayer = new PIXI.Graphics();
    blackLayer.beginFill(0x000000);
    blackLayer.drawRect(0,0,w,h);
    blackLayer.endFill();
    blackLayer.alpha = 0;
    foreground.addChild(blackLayer)

    d = new PIXI.Sprite(ploader.resources.depth.texture);
    d.width = w;
    d.height = h;
    container.addChild(d);
    displacementFilter = new PIXI.filters.DisplacementFilter(d, 0);

    window.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 60;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 60;

      displacementFilter.scale.x = offsetX;
      displacementFilter.scale.y = offsetY;
    });

    blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 0;
    fg.filters = [displacementFilter, blurFilter];

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

  function animate() {
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
  
  let targetAlpha = 0;
  
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      targetBlur = 10;
      targetAlpha = 0.4;
      let blurTween = new TWEEN.Tween({ blur: blurFilter.blur })
        .to({ blur: targetBlur }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
          blurFilter.blur = obj.blur;
        })
        .start();
  
      let alphaTween = new TWEEN.Tween({ alpha: blackLayer.alpha })
        .to({ alpha: targetAlpha }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
          blackLayer.alpha = obj.alpha;
        })
        .start();
    });
  
    link.addEventListener("mouseout", () => {
      targetBlur = 0;
      targetAlpha = 0;
      let blurTween = new TWEEN.Tween({ blur: blurFilter.blur })
        .to({ blur: targetBlur }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
          blurFilter.blur = obj.blur;
        })
        .start();
  
      let alphaTween = new TWEEN.Tween({ alpha: blackLayer.alpha })
        .to({ alpha: targetAlpha }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
          blackLayer.alpha = obj.alpha;
        })
        .start();
    });
  });
})  