const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  const light = root.dataset.theme === 'dark';
  root.dataset.theme = light ? 'light' : 'dark';
  toggle.textContent = light ? 'Dark' : 'Light';
  toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  toggle.setAttribute('aria-pressed', String(light));
});
document.querySelectorAll('[data-link]').forEach(link => {
  const key = link.dataset.link;
  if (key === 'email') {
    link.href = 'mailto:' + window.portfolioConfig.email;
    if (link.dataset.showEmail === 'true') link.textContent = window.portfolioConfig.email;
  } else if (window.portfolioConfig[key]) {
    link.href = window.portfolioConfig[key];
  }
});
const copy = document.querySelector('.copy-email');
if (copy) {
  copy.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(window.portfolioConfig.email);
      status.textContent = 'Email copied.';
    } catch {
      status.textContent = 'Copy unavailable. Email: ' + window.portfolioConfig.email;
    }
  });
}

const menuButton = document.querySelector('.menu-toggle');
const menuPanel = document.getElementById('section-menu');
function closeMenu(returnFocus = false) {
  menuPanel.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuPanel.hidden = !open;
  menuButton.textContent = open ? 'Close' : 'Menu';
});
menuPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menuPanel.hidden) closeMenu(true);
});
const compactNav = window.matchMedia('(max-width: 900px)');
compactNav.addEventListener('change', () => closeMenu());

const sectionLinks = [...document.querySelectorAll('[data-section]')];
const sections = [...document.querySelectorAll('main > section[id]')]
  .filter(section => sectionLinks.some(link => link.dataset.section === section.id));
let lastSection;
let scheduled = false;
function updateCurrentSection() {
  scheduled = false;
  const boundary = Math.min(150, innerHeight * 0.2);
  let active;
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= boundary) active = section.id;
  });
  if (sections.length && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2) {
    active = sections[sections.length - 1].id;
  }
  if (active === lastSection) return;
  lastSection = active;
  sectionLinks.forEach(link => {
    if (link.dataset.section === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleCurrentSection() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  }
}
window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
window.addEventListener('resize', scheduleCurrentSection);
updateCurrentSection();
