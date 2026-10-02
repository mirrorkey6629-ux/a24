import './style.css';
import { initFooterGame } from './footer-game.js';

function startGame() {
  initFooterGame('#footer-game');
}

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(startGame, { timeout: 2000 });
} else {
  window.setTimeout(startGame, 200);
}

function initScrollCurve() {
  const elements = [...document.querySelectorAll('.case')];
  if (!elements.length) return;

  const centerY = new Array(elements.length).fill(0);
  const previousProgress = new Array(elements.length).fill(Number.NaN);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let resizeObserver;

  function readSettings() {
    const styles = getComputedStyle(document.documentElement);
    const number = (name) => Number.parseFloat(styles.getPropertyValue(name));
    const tilt = number('--curve-tilt');
    const scaleAngle = number('--curve-scale-angle');
    const depthRatio = number('--curve-depth');
    const falloff = number('--curve-falloff');
    const recedeReach = number('--curve-recede-reach');
    return {
      tilt: Number.isFinite(tilt) ? tilt : 0,
      scaleAngle: Number.isFinite(scaleAngle) ? scaleAngle : 14,
      depthRatio: Number.isFinite(depthRatio) && depthRatio > 0 ? depthRatio : 100000,
      falloff: Number.isFinite(falloff) && falloff > 0 ? falloff : 1,
      recedeReach: Number.isFinite(recedeReach) && recedeReach > 0 ? recedeReach : 0,
    };
  }

  let settings = readSettings();

  function absoluteCenterY(element) {
    let value = element.offsetHeight / 2;
    for (let node = element; node; node = node.offsetParent) value += node.offsetTop;
    return value;
  }

  function measure() {
    elements.forEach((element, index) => {
      centerY[index] = absoluteCenterY(element);
      element.style.setProperty('--curve-plane', `${(element.offsetHeight * settings.depthRatio).toFixed(2)}px`);
      previousProgress[index] = Number.NaN;
    });
  }

  function update() {
    frame = 0;
    const viewportHeight = window.innerHeight;
    if (!viewportHeight) return;
    const effectStartRatio = .38;
    const effectStartY = window.scrollY + viewportHeight * effectStartRatio;
    const effectDistance = viewportHeight * effectStartRatio;
    const maxProgress = 1 + settings.recedeReach;

    elements.forEach((element, index) => {
      const progress = Math.max(0, Math.min(maxProgress, (effectStartY - centerY[index]) / effectDistance));
      if (Math.abs(progress - previousProgress[index]) < .002) return;
      previousProgress[index] = progress;

      const curve = Math.min(progress, 1) ** settings.falloff;
      const past = settings.recedeReach > 0
        ? Math.min(Math.max(progress - 1, 0) / settings.recedeReach, 1)
        : 0;
      const depthLoss = Math.abs(Math.sin(curve * settings.scaleAngle * Math.PI / 180)) / (2 * settings.depthRatio);
      const fit = 1 - Math.min(depthLoss, .8);

      element.style.setProperty('--curve-t', curve.toFixed(4));
      element.style.setProperty('--curve-fit', fit.toFixed(5));
      element.style.setProperty('--curve-past', past.toFixed(4));
    });
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function handleResize() {
    settings = readSettings();
    measure();
    requestUpdate();
  }

  function start() {
    handleResize();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.documentElement);
    }
  }

  function stop() {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', handleResize);
    resizeObserver?.disconnect();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    elements.forEach((element) => {
      ['--curve-t', '--curve-fit', '--curve-past', '--curve-plane']
        .forEach((property) => element.style.removeProperty(property));
    });
  }

  function syncMotionPreference() {
    if (reducedMotion.matches) stop();
    else start();
  }

  reducedMotion.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
}

initScrollCurve();
