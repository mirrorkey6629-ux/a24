import './style.css';
import { initFooterGame } from './footer-game.js';

let gameStarted = false;

function normalizeParagraphPunctuation() {
  const paragraphs = document.querySelectorAll('.profile__intro, .copy p:not(.eyebrow)');

  paragraphs.forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    if (text && !/[.!?…]$/.test(text)) paragraph.append('.');
  });
}

normalizeParagraphPunctuation();

function initProjectTags() {
  document.querySelectorAll('.case:not(.case--poster)').forEach((project) => {
    const eyebrow = project.querySelector('.eyebrow');
    const heading = project.querySelector('h2');
    if (!eyebrow || !heading) return;

    const [brand, year] = eyebrow.textContent.split(',').map((part) => part.trim());
    if (brand && brand !== 'Звук' && brand !== 'Skillbox' && !heading.textContent.includes(brand)) heading.append(` ${brand}`);

    const tags = document.createElement('div');
    tags.className = 'tags';
    const company = brand === 'Skillbox' ? 'SKILLBOX' : 'ZVUK';
    const values = project.classList.contains('case--phone')
      ? [year, company, 'APP']
      : [year, company, 'WEB'];

    values.filter(Boolean).forEach((value) => {
      const tag = document.createElement('span');
      tag.textContent = value;
      tags.append(tag);
    });

    heading.before(tags);
    eyebrow.remove();
  });
}

initProjectTags();

const englishProjects = [
  {
    title: 'Main screen of the app',
    paragraphs: [
      'Before the redesign, the home screen featured a personalized radio stream that only 30% of users listened to. Everyone else played their own music or playlists based on selections or artists.',
      'As a result, the home screen was useful to only a small portion of the service’s audience, while everyone else had to navigate through the app to find what they wanted to play.',
      'We wanted to let users instantly play what they were most likely to listen to at that particular time, directly from the home screen, with a brief explanation of why the content was being recommended.',
      'This would reduce the time from opening the app to starting playback and increase ALT (average listening time) by serving more relevant content.',
    ],
  },
  {
    title: 'Track migration',
    paragraphs: [
      'After releasing the first version of the migration flow, we found that most users skipped the step of adding tracks to Favorites because it appeared after playlist migration.',
      'This was critical because 90% of users transferred their “Liked Songs” playlist from Yandex Music and expected the tracks to be added to the right place automatically.',
      'We moved the Add to Favorites step to the start screen, added a paste-link button, and refreshed the visual design to match the new style.',
    ],
  },
  {
    title: 'Music portrait',
    paragraphs: [
      'This was one of those projects that never made it to production and remained a concept after business priorities changed.',
      'We wanted to create a viral page with listening statistics that would be fun to share with friends, explore your musical taste, and see how the service perceives you.',
      'It also allowed users to tune their preferences by specifying what they liked and disliked, giving them direct influence over recommendations and helping them personalize Zvuk.',
    ],
  },
  {
    title: 'Music player',
    paragraphs: [
      'When we started, the player was deeply rooted in legacy code, and there were no design layouts at all. We had ambitious plans and several product hypotheses, but they were blocked by the player’s rigid layout and the need to reverse-engineer how everything worked each time.',
      'In the first stage, we made the layout more flexible, added an action bar with quick controls, and cleaned up the rough parts.',
      'In the second stage, we polished the visuals and added interactive Lottie animations for icons, track-switching animations, and interactions with the player’s content.',
      'Finally, we developed a second layer of the player that helps users discover similar content in the moment and supports side scenarios such as buying concert tickets and discovering artists.',
    ],
  },
  {
    title: 'Content pages',
    paragraphs: [
      'Searching for and saving content are essential parts of the core experience in any music service. During my two years at Zvuk, I worked on playlist, book, podcast, and artist pages, as well as user listening insights, the collection, and search.',
      'The main goal was to create a consistent visual and functional experience across content discovery and collection flows.',
      'We gradually expanded the feature set while shaping a flow in which users can easily find something to listen to, return to saved content in their collection, understand how the service interprets their behavior, and refine their taste profile and recommendations.',
    ],
  },
  {
    title: 'Homepage',
    paragraphs: [
      'This was a highly complex task: communicate the brand, showcase the products, and refine the visual style.',
      'Our broader goal was to create an engaging page that would give a strong first impression of the company, explain the value of online education and the learning format, and immediately present the company’s core product matrix instead of the collection of banners it had been before.',
      'We separately briefed a photographer and organized a photoshoot with our students so their portraits could appear on the homepage and communicate that Skillbox is not merely about courses—it is about people and how online education changes their lives.',
    ],
  },
  {
    title: 'Landing page builder',
    paragraphs: [
      'This was a mammoth system that had existed for several years and accumulated a large number of unnecessary blocks. We first needed to audit every block available in the builder and decide which ones were useful and which were not.',
      'We then refined the visuals and meaning of the core blocks, developed a new version, and migrated the first ten landing pages to it.',
      'The work required close collaboration with marketing, C-level stakeholders, editorial, and communication design. Landing pages were the company’s primary sales tool, there were many stakeholders, and the cost of a mistake was high.',
    ],
  },
  {
    title: 'Not work-related',
    paragraphs: [
      'In my free time, I enjoy drawing posters, playful graphics, and charismatic characters with expressive eyes.',
      'I also love podcasts about history and physics, renovating, building furniture, and traveling.',
      'Lately, like everyone else, I have been riding the vibe-coding wave. I built a travel-planning website with an interactive Google map, a backend, and simultaneous trip editing for several users to make planning our trip to Japan easier.',
    ],
  },
];

function initLanguageSwitcher() {
  const toggle = document.querySelector('[data-language-toggle]');
  if (!toggle) return;
  const toggleText = toggle.querySelector('span:last-child');

  const intro = document.querySelector('.profile__intro');
  const footerIntro = document.querySelector('.footer-intro');
  const experienceItems = [...document.querySelectorAll('.experience__item')];
  const projects = [...document.querySelectorAll('.case')];
  const unsupported = document.querySelector('.unsupported p');
  const metaDescription = document.querySelector('meta[name="description"]');
  const columnLabels = [...document.querySelectorAll('.column-label:not([data-language-toggle])')];
  const navItems = [...document.querySelectorAll('.profile__nav-item')];

  const russianState = {
    intro: intro?.innerHTML ?? '',
    footerIntro: footerIntro?.innerHTML ?? '',
    experience: experienceItems.map((item) => ({
      name: item.querySelector('h2')?.innerHTML ?? '',
      duration: item.querySelector('span')?.innerHTML ?? '',
      description: item.querySelector('p')?.innerHTML ?? '',
    })),
    projects: projects.map((project) => ({
      title: project.querySelector('.copy h2')?.innerHTML ?? '',
      paragraphs: [...project.querySelectorAll('.copy > p:not(.eyebrow)')].map((paragraph) => paragraph.innerHTML),
    })),
    unsupported: unsupported?.innerHTML ?? '',
  };

  const experienceEnglish = [
    { name: 'Zvuk', duration: '2 years', description: 'A streaming service with music, audiobooks, and podcasts. My role is to design core mobile app experiences, develop concepts, and occasionally contribute to visual design.' },
    { name: 'Skillbox', duration: '5 years', description: 'An online education platform with 300+ courses. I led a team of marketing designers and designed the website’s key sections.' },
  ];

  const footerIntroEnglish = 'In&nbsp;my free time, I&nbsp;enjoy drawing posters, playful graphics,<br>and&nbsp;charismatic characters with&nbsp;expressive eyes. I&nbsp;also love podcasts about history and&nbsp;physics, renovating, building furniture, and&nbsp;traveling.';

  function protectEnglishShortWords(root) {
    if (!root) return;
    const shortWords = /\b(a|an|the|and|or|but|nor|so|yet|as|at|by|for|from|in|into|of|on|onto|over|per|to|up|via|with|within|without|because|if|than|that|while)\s+/gi;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(shortWords, '$1\u00a0');
    });
  }

  function setProject(project, translation, useEnglish) {
    const title = project.querySelector('.copy h2');
    const paragraphs = [...project.querySelectorAll('.copy > p:not(.eyebrow)')];
    if (title) title[useEnglish ? 'textContent' : 'innerHTML'] = translation.title;
    paragraphs.forEach((paragraph, index) => {
      const value = translation.paragraphs[index];
      if (value !== undefined) paragraph[useEnglish ? 'textContent' : 'innerHTML'] = value;
    });
  }

  function applyLanguage(language) {
    const useEnglish = language === 'en';
    document.documentElement.lang = useEnglish ? 'en' : 'ru';
    document.title = useEnglish ? 'Anya Fendik — Product Designer' : 'Анна Фендик — продуктовый дизайнер';
    if (metaDescription) metaDescription.content = useEnglish
      ? 'Portfolio of product designer Anya Fendik'
      : 'Портфолио продуктового дизайнера Анны Фендик';

    if (intro) intro[useEnglish ? 'textContent' : 'innerHTML'] = useEnglish
      ? 'Hi, I’m Anya, a product designer based in Moscow. I love creating impactful experiences, obsessing over details, thinking beyond the immediate task, and working as part of a team.'
      : russianState.intro;
    if (footerIntro) footerIntro.innerHTML = useEnglish
      ? footerIntroEnglish
      : russianState.footerIntro;

    experienceItems.forEach((item, index) => {
      const translation = useEnglish ? experienceEnglish[index] : russianState.experience[index];
      const name = item.querySelector('h2');
      const duration = item.querySelector('span');
      const description = item.querySelector('p');
      if (name) name[useEnglish ? 'textContent' : 'innerHTML'] = translation.name;
      if (duration) duration[useEnglish ? 'textContent' : 'innerHTML'] = translation.duration;
      if (description) description[useEnglish ? 'textContent' : 'innerHTML'] = translation.description;
    });

    projects.forEach((project, index) => {
      setProject(project, useEnglish ? englishProjects[index] : russianState.projects[index], useEnglish);
    });

    const navTexts = useEnglish
      ? ['Telegram', 'Mail', 'CV']
      : ['Телеграм', 'Почта', 'Резюме'];
    navItems.forEach((item, index) => {
      item.textContent = navTexts[index];
    });

    const labelTexts = useEnglish
      ? ['ABOUT', 'LOOK', 'READ']
      : ['ОБО МНЕ', 'ПОСМОТРЕТЬ', 'ПОЧИТАТЬ'];
    columnLabels.forEach((label, index) => {
      label.textContent = labelTexts[index];
    });
    if (unsupported) unsupported[useEnglish ? 'textContent' : 'innerHTML'] = useEnglish
      ? 'Sorry, this screen size is not supported yet.'
      : russianState.unsupported;

    document.querySelectorAll('.phone video').forEach((video) => {
      video.setAttribute('aria-label', useEnglish ? 'Product demo video' : 'Демонстрация проекта');
    });
    document.querySelectorAll('.case--wide > a').forEach((link) => {
      link.setAttribute('aria-label', useEnglish ? 'Open the project in a new tab' : 'Открыть проект в новой вкладке');
    });
    toggle.setAttribute('aria-label', useEnglish ? 'Switch language to Russian' : 'Переключить язык на английский');
    if (toggleText) toggleText.textContent = useEnglish ? 'EN' : 'RU';
    if (useEnglish) {
      document.querySelectorAll('.profile__intro, .experience, .copy, .footer-intro, .unsupported p')
        .forEach(protectEnglishShortWords);
    }
    localStorage.setItem('portfolio-language-v2', language);
  }

  let currentLanguage = localStorage.getItem('portfolio-language-v2') === 'ru' ? 'ru' : 'en';
  toggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    applyLanguage(currentLanguage);
  });
  applyLanguage(currentLanguage);
}

initLanguageSwitcher();

function startGame() {
  const game = document.querySelector('#footer-game');
  if (gameStarted || !game || window.innerWidth < 1200 || game.getClientRects().length === 0) return;
  initFooterGame('#footer-game');
  gameStarted = true;
}

startGame();
window.addEventListener('resize', startGame);

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
    const effectDistance = viewportHeight * .65;
    const maxProgress = 1 + settings.recedeReach;

    elements.forEach((element, index) => {
      const effectStartY = window.scrollY + element.offsetHeight / 6;
      const progress = Math.max(0, Math.min(maxProgress, (effectStartY - centerY[index]) / effectDistance));
      if (Math.abs(progress - previousProgress[index]) < .002) return;
      previousProgress[index] = progress;

      const curve = Math.min(progress, 1) ** settings.falloff;
      const past = settings.recedeReach > 0
        ? Math.min(Math.max(progress - 1, 0) / settings.recedeReach, 1)
        : 0;
      const depthLoss = Math.abs(Math.sin(curve * settings.scaleAngle * Math.PI / 180)) / (2 * settings.depthRatio);
      const fit = 1 - Math.min(depthLoss, .8);
      const pullProgress = Math.max(0, Math.min(1, (progress - .5) / .5));
      const pull = -72 * pullProgress ** 1.35;

      element.style.setProperty('--curve-t', curve.toFixed(4));
      element.style.setProperty('--curve-fit', fit.toFixed(5));
      element.style.setProperty('--curve-past', past.toFixed(4));
      element.style.setProperty('--curve-pull', `${pull.toFixed(2)}px`);
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
      ['--curve-t', '--curve-fit', '--curve-past', '--curve-pull', '--curve-plane']
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

function initGameReveal() {
  const game = document.querySelector('#footer-game');
  if (!game) return;

  let frame = 0;

  function update() {
    frame = 0;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const revealDistance = Math.min(320, maxScroll);
    const revealStart = maxScroll - revealDistance;
    const progress = revealDistance > 0
      ? Math.max(0, Math.min(1, (window.scrollY - revealStart) / revealDistance))
      : 1;

    game.style.setProperty('--game-offset', `${((1 - progress) * 100).toFixed(2)}%`);
    game.style.pointerEvents = progress > .98 ? 'auto' : 'none';
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

initGameReveal();

function initExclusiveVideoPlayback() {
  const videos = [...document.querySelectorAll('.phone video')];
  if (!videos.length) return;

  let frame = 0;
  let activeVideo = null;

  function update() {
    frame = 0;

    if (document.hidden) {
      videos.forEach((video) => video.pause());
      activeVideo = null;
      return;
    }

    let nextVideo = null;
    let largestVisibleArea = 0;

    videos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      const visibleArea = visibleWidth * visibleHeight;

      if (visibleArea > largestVisibleArea) {
        largestVisibleArea = visibleArea;
        nextVideo = video;
      }
    });

    if (nextVideo === activeVideo) return;
    activeVideo = nextVideo;

    videos.forEach((video) => {
      if (video === activeVideo) video.play().catch(() => {});
      else video.pause();
    });
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  videos.forEach((video) => {
    video.pause();

    const reveal = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => video.classList.add('is-ready')));
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reveal();
    else video.addEventListener('loadeddata', reveal, { once: true });
  });
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.addEventListener('visibilitychange', requestUpdate);
  update();
}

initExclusiveVideoPlayback();

function initProjectSheets() {
  const projects = [...document.querySelectorAll('.portfolio--variant-two > .case--home, .portfolio--variant-two > .case--player, .portfolio--variant-two > .case--migration, .portfolio--variant-two > .case--selection, .portfolio--variant-two > .case--skillbox-home, .portfolio--variant-two > .case--skillbox-builder')];
  if (!projects.length) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'project-sheet-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <div class="project-sheet-backdrop__title" id="project-sheet-title"></div>
    <button class="project-sheet-backdrop__close" type="button" aria-label="Закрыть проект"><span aria-hidden="true"></span></button>
    <nav class="project-sheet-backdrop__nav" aria-label="Навигация по проектам">
      <button class="project-sheet__previous" type="button">Предыдущий</button>
      <span aria-hidden="true">&thinsp;/&thinsp;</span>
      <button class="project-sheet__next" type="button">Следующий</button>
    </nav>`;

  const sheet = document.createElement('section');
  sheet.className = 'project-sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'project-sheet-title');
  sheet.setAttribute('tabindex', '-1');
  sheet.innerHTML = `
    <div class="project-sheet__content">
      <header class="project-sheet__header">
        <div class="project-sheet__tags tags"></div>
        <h1 class="project-sheet__title" id="project-sheet-title"></h1>
      </header>
      <div class="project-sheet__media"></div>
    </div>`;

  document.body.append(backdrop, sheet);

  const title = backdrop.querySelector('.project-sheet-backdrop__title');
  const sheetTitle = sheet.querySelector('.project-sheet__title');
  const sheetTags = sheet.querySelector('.project-sheet__tags');
  const media = sheet.querySelector('.project-sheet__media');
  const closeButton = backdrop.querySelector('.project-sheet-backdrop__close');
  const previousButton = backdrop.querySelector('.project-sheet__previous');
  const nextButton = backdrop.querySelector('.project-sheet__next');
  let trigger = null;
  let currentProjectIndex = 0;
  let projectSwitchTimer = 0;

  function createMedia(project) {
    const galleryConfig = project.classList.contains('case--home')
      ? { folder: 'companion', count: 9, wide: [1, 4, 7] }
      : project.classList.contains('case--player')
        ? { folder: 'maxiplayer', count: 6, order: [1, 2, 3, 4, 5, 6], wide: [1, 4] }
      : project.classList.contains('case--migration')
        ? { folder: 'migration', count: 5, wide: [1] }
      : project.classList.contains('case--selection')
        ? { folder: 'track-selection', count: 7, wide: [3] }
      : project.classList.contains('case--skillbox-home')
        ? {
          folder: 'skillbox-home',
          order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          wide: [1, 4, 9, 12, 17],
          videos: {
            10: 'main-video-v4-4.webm',
            11: 'main-video-v4-3.webm',
          },
        }
      : project.classList.contains('case--skillbox-builder')
        ? {
          folder: 'skillbox-builder',
          order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          wide: [1, 4, 7, 10, 13, 16],
          videos: {
            5: 'video-5.mp4',
            6: 'video-6.mp4',
          },
          portraitVideos: {
            9: ['woman.mp4', 'man.mp4'],
          },
        }
        : null;

    if (galleryConfig) {
      const gallery = document.createElement('div');
      gallery.className = 'project-sheet__gallery';

      const imageOrder = galleryConfig.order ?? Array.from({ length: galleryConfig.count }, (_, index) => index + 1);

      for (const index of imageOrder) {
        const portraitVideoFiles = galleryConfig.portraitVideos?.[index];
        if (portraitVideoFiles) {
          const portraitCard = document.createElement('div');
          portraitCard.className = 'project-sheet__gallery-portrait-videos';

          for (const portraitVideoFile of portraitVideoFiles) {
            const portraitVideo = document.createElement('video');
            portraitVideo.src = `${import.meta.env.BASE_URL}assets/${galleryConfig.folder}/${portraitVideoFile}`;
            portraitVideo.muted = true;
            portraitVideo.loop = true;
            portraitVideo.playsInline = true;
            portraitVideo.autoplay = true;
            portraitVideo.preload = 'auto';
            portraitCard.append(portraitVideo);
          }

          gallery.append(portraitCard);
          continue;
        }

        const videoFile = galleryConfig.videos?.[index];
        if (videoFile) {
          const videoCard = document.createElement('div');
          videoCard.className = 'project-sheet__gallery-video-card';

          const video = document.createElement('video');
          video.src = `${import.meta.env.BASE_URL}assets/${galleryConfig.folder}/${videoFile}`;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.autoplay = true;
          video.preload = 'auto';
          videoCard.append(video);
          gallery.append(videoCard);
          continue;
        }

        const image = document.createElement('img');
        image.src = `${import.meta.env.BASE_URL}assets/${galleryConfig.folder}/${index}.png`;
        image.alt = '';
        image.loading = 'eager';
        if (galleryConfig.wide.includes(index)) image.classList.add('project-sheet__gallery-wide');
        gallery.append(image);
      }

      return gallery;
    }

    const video = project.querySelector('.phone__screen');
    const frame = project.querySelector('.phone__frame');
    const image = project.querySelector('.wide-image');

    if (video && frame) {
      const phone = document.createElement('div');
      phone.className = 'project-sheet__phone';

      const videoCopy = document.createElement('video');
      videoCopy.src = video.currentSrc || video.src;
      videoCopy.muted = true;
      videoCopy.loop = true;
      videoCopy.playsInline = true;
      videoCopy.autoplay = true;

      const frameCopy = document.createElement('img');
      frameCopy.src = frame.src;
      frameCopy.alt = '';

      phone.append(videoCopy, frameCopy);
      return phone;
    }

    if (image) {
      const imageCopy = image.cloneNode(true);
      imageCopy.className = 'project-sheet__image';
      return imageCopy;
    }

    return document.createElement('div');
  }

  function revealGallery(projectMedia) {
    if (!projectMedia.classList.contains('project-sheet__gallery')) return;
    const assets = [...projectMedia.querySelectorAll('img, video')];
    Promise.all(assets.map((asset) => {
      if (asset instanceof HTMLImageElement && asset.complete && asset.naturalWidth) return Promise.resolve();
      if (asset instanceof HTMLVideoElement && asset.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
      return new Promise((resolve) => {
        asset.addEventListener(asset instanceof HTMLVideoElement ? 'loadeddata' : 'load', resolve, { once: true });
        asset.addEventListener('error', resolve, { once: true });
      });
    })).then(() => {
      if (!media.contains(projectMedia)) return;
      requestAnimationFrame(() => projectMedia.classList.add('is-ready'));
    });
  }

  function renderProject(project) {
    sheet.scrollTop = 0;
    const projectTitle = project.querySelector('.copy h2')?.textContent || '';
    const projectCounter = document.createElement('span');
    projectCounter.textContent = `${currentProjectIndex + 1}\u2009/\u20097`;
    const backdropProjectTitle = document.createElement('span');
    backdropProjectTitle.textContent = projectTitle;
    title.replaceChildren(projectCounter, backdropProjectTitle);
    sheetTitle.textContent = projectTitle;
    sheetTags.replaceChildren(...[...project.querySelectorAll('.copy .tags span')].map((tag) => tag.cloneNode(true)));
    const projectMedia = createMedia(project);
    media.replaceChildren(projectMedia);
    revealGallery(projectMedia);
    const useEnglish = document.documentElement.lang === 'en';
    previousButton.textContent = useEnglish ? 'Previous' : 'Предыдущий';
    nextButton.textContent = useEnglish ? 'Next' : 'Следующий';
  }

  function open(project, source) {
    trigger = source;
    currentProjectIndex = projects.indexOf(project);
    renderProject(project);
    backdrop.hidden = false;
    sheet.hidden = false;
    backdrop.classList.remove('is-closing');
    document.body.classList.add('project-sheet-open');
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      sheet.classList.add('is-open');
      closeButton.focus({ preventScroll: true });
      media.querySelector('video')?.play().catch(() => {});
    });
  }

  function showRelativeProject(direction) {
    if (projectSwitchTimer) return;
    currentProjectIndex = (currentProjectIndex + direction + projects.length) % projects.length;
    const currentGallery = media.querySelector('.project-sheet__gallery');
    if (!currentGallery) {
      renderProject(projects[currentProjectIndex]);
      return;
    }

    currentGallery.classList.remove('is-ready');
    projectSwitchTimer = window.setTimeout(() => {
      projectSwitchTimer = 0;
      renderProject(projects[currentProjectIndex]);
    }, 150);
  }

  function close() {
    sheet.scrollTop = 0;
    window.clearTimeout(projectSwitchTimer);
    projectSwitchTimer = 0;
    backdrop.classList.add('is-closing');
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    document.body.classList.remove('project-sheet-open');
    media.querySelector('video')?.pause();
    window.setTimeout(() => {
      backdrop.hidden = true;
      sheet.hidden = true;
      sheet.scrollTop = 0;
      media.replaceChildren();
      trigger?.focus({ preventScroll: true });
      trigger = null;
    }, 500);
  }

  projects.forEach((project) => {
    const visual = project.querySelector('.phone, .case--wide > a');
    const heading = project.querySelector('.copy h2');

    [visual, heading].filter(Boolean).forEach((control) => {
      control.classList.add('project-sheet-trigger');
      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute('aria-haspopup', 'dialog');

      control.addEventListener('click', (event) => {
        if (control.tagName === 'A') event.preventDefault();
        open(project, control);
      });
      control.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open(project, control);
      });
    });
  });

  backdrop.addEventListener('click', close);
  previousButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showRelativeProject(-1);
  });
  nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showRelativeProject(1);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sheet.classList.contains('is-open')) close();
  });
}

initProjectSheets();

function initPosterCarousel() {
  const carousel = document.querySelector('.poster-carousel');
  const slides = carousel ? [...carousel.querySelectorAll('.poster-slide')] : [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!carousel || slides.length < 2 || reducedMotion.matches) return;

  let currentIndex = 0;
  let timer = 0;
  let isVisible = false;
  let isAnimating = false;

  function showSlide(nextIndex, direction = 1) {
    if (isAnimating || nextIndex === currentIndex) return;
    isAnimating = true;

    const current = slides[currentIndex];
    const next = slides[nextIndex];

    next.classList.remove('is-active', 'is-exiting', 'exit-right', 'from-left');
    if (direction < 0) next.classList.add('from-left');
    void next.offsetWidth;

    current.classList.remove('is-active');
    current.classList.add('is-exiting');
    if (direction < 0) current.classList.add('exit-right');
    next.classList.add('is-active');
    next.classList.remove('from-left');
    currentIndex = nextIndex;

    window.setTimeout(() => {
      current.classList.remove('is-exiting', 'exit-right');
      isAnimating = false;
    }, 950);
  }

  function showNext() {
    showSlide((currentIndex + 1) % slides.length, 1);
  }

  function start() {
    if (timer || !isVisible || document.hidden) return;
    timer = window.setInterval(showNext, 5000);
  }

  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = 0;
  }

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
    else stop();
  }, { threshold: .15 });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  observer.observe(carousel);
}

initPosterCarousel();
