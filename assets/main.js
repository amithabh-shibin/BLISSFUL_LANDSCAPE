const menu = document.querySelector('.menu');
const navigation = document.querySelector('#main-nav');
if (menu && navigation) {
  menu.hidden = false;
  function setMenu(open) {
    navigation.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
}

const carousel = document.querySelector('.hero');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.slide')];
  const controls = carousel.querySelector('.carousel-controls');
  const pauseButton = controls.querySelector('[data-slide="pause"]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = motion.matches;
  let pointerInside = false;
  let timer;

  function show(index) {
    slides[current].hidden = true;
    current = (index + slides.length) % slides.length;
    slides[current].hidden = false;
  }

  function schedule() {
    window.clearInterval(timer);
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
    pauseButton.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    if (!paused && !pointerInside && !carousel.contains(document.activeElement) && !document.hidden) {
      timer = window.setInterval(() => show(current + 1), 7000);
    }
  }

  controls.hidden = false;
  controls.addEventListener('click', (event) => {
    const action = event.target.closest('button')?.dataset.slide;
    if (action === 'pause') paused = !paused;
    if (action === 'prev') show(current - 1);
    if (action === 'next') show(current + 1);
    schedule();
  });
  carousel.addEventListener('mouseenter', () => {
    pointerInside = true;
    schedule();
  });
  carousel.addEventListener('mouseleave', () => {
    pointerInside = false;
    schedule();
  });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    paused = motion.matches;
    schedule();
  });
  schedule();
}

const enquiry = document.querySelector('#enquiry');
if (enquiry) {
  enquiry.hidden = false;
  enquiry.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(enquiry);
    const message = [
      'Hello Blissful Landscape, I would like to request a quote.',
      '',
      'Name: ' + fields.get('name').trim(),
      'Service: ' + fields.get('service'),
      'Location: ' + fields.get('location').trim(),
      'Project details: ' + fields.get('details').trim()
    ].join('\n');
    const destination = new URL(enquiry.action);
    destination.searchParams.set('text', message);
    window.location.assign(destination.href);
  });
}
