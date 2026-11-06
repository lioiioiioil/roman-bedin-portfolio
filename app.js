import { profile } from './src/content.js';
import { projectArt } from './src/visuals.js';
import { setupProjectMotion } from './src/project-motion.js';

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

function renderIdentity() {
  const title = $('#hero-title');
  if (!title) return;
  title.replaceChildren(document.createTextNode(profile.name), element('span', 'hero-dot', '.'));
  $('.hero-role').textContent = profile.role;
  const technologies = $('.hero-technologies');
  technologies.replaceChildren();
  profile.skillsLine.forEach((skill) => technologies.append(element('li', '', skill)));
  document.title = `${profile.name} — ${profile.role}`;
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
    const article = element('article', 'expertise-item reveal');
    const title = element('div', 'expertise-name');
    title.append(element('span', 'expertise-number', item.number), element('h3', '', item.title));
    const body = element('div', 'expertise-body');
    body.append(element('p', '', item.description), tags(item.tags));
    article.append(title, body);
    list.append(article);
  });
}

function renderExperience() {
  const list = $('#experience-list');
  if (!list) return;
  profile.experience.forEach((item) => {
    const article = element('article', 'experience-item reveal');
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
    const link = externalLink(project.url, `project-card project-${project.visual} reveal`);
    const visual = element('div', 'project-art');
    visual.setAttribute('aria-hidden', 'true');
    // The illustrations are local, fixed SVGs; profile text is always inserted as text.
    const template = document.createElement('template');
    template.innerHTML = projectArt[project.visual];
    visual.append(template.content.cloneNode(true));
    const visualMeta = element('div', 'project-art-meta');
    visualMeta.append(element('span', '', `0${index + 1}`), element('span', '', project.tags[0]));
    visual.append(visualMeta);
    const body = element('div', 'project-body');
    const heading = element('div', 'project-heading');
    heading.append(element('h3', '', project.name), icon('arrow'));
    body.append(element('p', 'project-kind', project.kind), heading, element('p', 'project-description', project.description), tags(project.tags));
    link.append(visual, body);
    grid.append(link);
  });
}

function setupNavigation() {
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');
  if (!toggle || !nav) return;
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    nav.classList.remove('is-open');
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.header-inner')) closeMenu(); });

  const header = $('.site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 32);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (!('IntersectionObserver' in window)) return;
  const links = [...nav.querySelectorAll('a')];
  const sections = document.querySelectorAll('main > section[id]:not(#home)');
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px' });
  sections.forEach((section) => activeObserver.observe(section));
}

function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((item) => {
    item.classList.add('will-reveal');
    observer.observe(item);
  });
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

renderIdentity();
renderSocials();
renderAbout();
renderExpertise();
renderExperience();
renderProjects();
setupProjectMotion();

setupNavigation();
setupReveal();
setupContact();
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
