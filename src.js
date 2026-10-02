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
