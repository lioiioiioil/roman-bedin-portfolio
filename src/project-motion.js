export function setupProjectMotion() {
  const projects = [...document.querySelectorAll('.project-card')].map((card) => ({
    card,
    art: card.querySelector('.project-art'),
    svg: card.querySelector('.project-art > svg'),
  })).filter(({ svg }) => typeof svg?.pauseAnimations === 'function');
  if (!projects.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverLayout = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
  const header = document.querySelector('.site-header');
  let active = null;
  let frame = null;

  // Each illustration has its own SVG clock, including motion paths and status changes.
  projects.forEach(({ svg }) => svg.pauseAnimations());

  function update() {
    frame = null;
    const height = window.innerHeight;
    const top = header?.getBoundingClientRect().bottom ?? 0;
    const center = (top + height) / 2;
    let next = null;

    if (!reducedMotion.matches && !document.hidden) {
      const visibleProjects = projects.filter(({ art }) => {
        const bounds = art.getBoundingClientRect();
        const visible = Math.min(bounds.bottom, height) - Math.max(bounds.top, top);
        return bounds.height > 0 && visible >= Math.min(bounds.height * .35, 60);
      });
      if (hoverLayout.matches) {
        next = visibleProjects.find(({ card }) => card.matches(':hover'))
          ?? visibleProjects.find(({ card }) => card.matches(':focus-visible'))
          ?? null;
      } else {
        let nearest = Infinity;
        for (const project of visibleProjects) {
          const card = project.card.getBoundingClientRect();
          const distance = Math.abs(card.top + card.height / 2 - center);
          if (distance < nearest) {
            nearest = distance;
            next = project;
          }
        }
      }
    }

    if (next === active) return;
    if (active) {
      active.svg.pauseAnimations();
      active.card.classList.remove('is-animating');
    }
    active = next;
    if (active) {
      active.svg.unpauseAnimations();
      active.card.classList.add('is-animating');
    }
  }

  function scheduleUpdate() {
    if (frame === null) frame = window.requestAnimationFrame(update);
  }

  function updateNow() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    update();
  }

  projects.forEach(({ card }) => {
    ['pointerenter', 'pointerleave', 'focusin', 'focusout'].forEach((event) => {
      card.addEventListener(event, scheduleUpdate);
    });
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  document.addEventListener('visibilitychange', updateNow);
  reducedMotion.addEventListener('change', updateNow);
  hoverLayout.addEventListener('change', scheduleUpdate);
  scheduleUpdate();
}
