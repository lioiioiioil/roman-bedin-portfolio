import { profile } from './src/content.js?v=unslop-2';
import { projectArt } from './src/visuals.js?v=unslop-2';
import { setupProjectMotion } from './src/project-motion.js?v=unslop-2';

const $ = (selector) => document.querySelector(selector);
const CONTACT_PLACEHOLDER = '[вот тут мои данные]';
const hasContact = (value) => Boolean(value && value !== CONTACT_PLACEHOLDER);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
}

function externalLink(url, className, label) {
  const link = element('a', className, label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function tags(items) {
  const list = element('ul', 'tags');
  items.forEach((item) => list.append(element('li', 'tag', item)));
  return list;
}

function renderSocials() {
  const socials = [
    ['github', profile.contacts.github, 'GitHub'],
    ['telegram', profile.contacts.telegram, 'Telegram'],
    ['mail', profile.contacts.email, 'Написать на почту'],
  ];
  document.querySelectorAll('[data-socials]').forEach((container) => {
    socials.filter(([, value]) => hasContact(value)).forEach(([name, value, label]) => {
      const url = name === 'mail' ? `mailto:${value}` : value;
      const link = name === 'mail' ? element('a', 'social-link') : externalLink(url, 'social-link');
      link.href = url;
      link.setAttribute('aria-label', label);
      link.title = label;
      link.append(icon(name));
      container.append(link);
    });
  });
}

function renderAbout() {
  const copy = $('#about-copy');
  if (!copy) return;
  profile.about.forEach((paragraph) => copy.append(element('p', '', paragraph)));
}

function renderExpertise() {
  const list = $('#expertise-list');
  if (!list) return;
  profile.expertise.forEach((item) => {
    const article = element('article', 'expertise-item');
    const body = element('div', 'expertise-body');
    body.append(element('p', '', item.description), tags(item.tags));
    article.append(element('h3', '', item.title), body);
    list.append(article);
  });
}

function renderExperience() {
  const list = $('#experience-list');
  if (!list) return;
  profile.experience.forEach((item) => {
    const article = element('article', 'experience-item');
    const top = element('div', 'experience-top');
    top.append(element('h3', '', item.organization), element('span', 'experience-year', item.year));
    article.append(top, element('p', 'experience-role', item.role));
    item.paragraphs.forEach((paragraph) => article.append(element('p', 'experience-copy', paragraph)));
    if (item.highlight) article.append(element('p', 'experience-highlight', item.highlight));
    article.append(tags(item.tags));
    list.append(article);
  });
}

function renderProjects() {
  const grid = $('#project-grid');
  if (!grid) return;
  profile.projects.forEach((project, index) => {
    const link = externalLink(project.url, `project-card project-${project.visual}`);
    if (index === 0) link.classList.add('project-featured');
    const visual = element('div', 'project-art');
    visual.setAttribute('aria-hidden', 'true');
    // The illustrations are local, fixed SVGs; profile text is always inserted as text.
    const template = document.createElement('template');
    template.innerHTML = projectArt[project.visual];
    visual.append(template.content.cloneNode(true));
    const body = element('div', 'project-body');
    const projectLink = element('span', 'project-link', 'Код на GitHub');
    projectLink.append(icon('arrow'));
    body.append(
      element('p', 'project-kind', project.kind),
      element('h3', 'project-heading', project.name),
      element('p', 'project-description', project.description),
      tags(project.tags),
      projectLink,
    );
    link.append(visual, body);
    grid.append(link);
  });
}

function setupNavigation() {
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');
  if (!toggle || !nav) return;
  const menuIsOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => setMenu(!menuIsOpen()));
  nav.addEventListener('click', (event) => {
    if (menuIsOpen() && event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menuIsOpen()) return;
    setMenu(false);
    toggle.focus({ preventScroll: true });
    event.preventDefault();
  });
  document.addEventListener('click', (event) => {
    if (menuIsOpen() && !event.target.closest('.header-inner')) setMenu(false);
  });
  window.matchMedia('(max-width: 700px)').addEventListener('change', () => setMenu(false));

  const header = $('.site-header');
  const links = [...nav.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (!sections.length) return;
  let frame = null;

  function updateCurrentSection() {
    frame = null;
    header?.classList.toggle('is-scrolled', window.scrollY > 32);
    const referenceY = (header?.getBoundingClientRect().bottom ?? 0) + 32;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top > referenceY) break;
      current = section;
    }

    const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollLimit > 0 && window.scrollY >= scrollLimit - 2) {
      current = sections[sections.length - 1];
    }

    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleCurrentSection() {
    if (frame === null) frame = window.requestAnimationFrame(updateCurrentSection);
  }

  window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
  window.addEventListener('resize', scheduleCurrentSection);
  window.addEventListener('hashchange', scheduleCurrentSection);
  updateCurrentSection();
}

function setupContact() {
  const email = $('#email-link');
  const telegram = $('#telegram-contact');
  const emailIsSet = hasContact(profile.contacts.email);
  if (email) {
    email.textContent = emailIsSet ? profile.contacts.email : CONTACT_PLACEHOLDER;
    if (emailIsSet) email.href = `mailto:${profile.contacts.email}`;
    else email.removeAttribute('href');
  }
  if (telegram) {
    if (hasContact(profile.contacts.telegram)) {
      telegram.href = profile.contacts.telegram;
      telegram.target = '_blank';
      telegram.rel = 'noopener noreferrer';
      telegram.removeAttribute('aria-disabled');
      telegram.replaceChildren(document.createTextNode('Написать в Telegram '), icon('arrow'));
    } else {
      telegram.removeAttribute('href');
      telegram.setAttribute('aria-disabled', 'true');
      telegram.textContent = CONTACT_PLACEHOLDER;
    }
  }
  const button = $('#copy-email');
  const status = $('#copy-status');
  if (!button || !status) return;
  button.hidden = !emailIsSet;
  if (!emailIsSet) return;
  let reset;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(profile.contacts.email);
      button.replaceChildren(icon('check'));
      status.textContent = 'Email скопирован';
    } catch {
      status.textContent = `Скопируйте email: ${profile.contacts.email}`;
    }
    window.clearTimeout(reset);
    reset = window.setTimeout(() => {
      button.replaceChildren(icon('copy'));
      status.textContent = '';
    }, 3500);
  });
}

renderSocials();
renderAbout();
renderExpertise();
renderExperience();
renderProjects();
setupProjectMotion();

setupNavigation();
setupContact();
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
