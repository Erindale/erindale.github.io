document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner");
  const pixiContainer = document.getElementById("pixi-container");
  const links = document.querySelectorAll(".link");

  let w = window.innerWidth;
  let h = window.innerHeight;
  const renderer = new PIXI.WebGLRenderer(w, h, {
    transparent: true,
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
    foreground.addChild(fg);

    d = new PIXI.Sprite(ploader.resources.depth.texture);
    displacementFilter = new PIXI.filters.DisplacementFilter(d, 0);
    fg.filters = [displacementFilter];

    window.addEventListener("mousemove", (e) => {
      const offsetX = (window.innerWidth / 2 - e.pageX) / 25;
      const offsetY = (window.innerHeight / 2 - e.pageY) / 25;

      displacementFilter.scale.x = offsetX;
      displacementFilter.scale.y = offsetY;
    });

    animate();
  }

  function animate() {
    fg.addChild(d);
    d.renderable = false;

    renderer.render(stage);
    requestAnimationFrame(animate);
  }
  
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
  