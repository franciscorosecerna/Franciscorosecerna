const terminalLines = document.querySelectorAll('.terminal-line');
const languageToggle = document.querySelector('.language-toggle');
const cvLink = document.querySelector('.cv-link, a[download][data-i18n="cvDownload"]');
const typingSpeed = 30;
const linePause = 300;
let terminalReady = false;
let animationRun = 0;

const translations = {
  es: {
    period:'2022 - 2026/2027 (esperado) 5º año',
    marketTitle:'Sistema de gestión de supermercado',
    miniXTitle:'MiniX — red social',
    myRegexTitle:'MyRegex — motor de expresiones regulares',
    miniHttpTitle:'MiniHTTP — servidor HTTP desde cero',
    navProjects:'Proyectos',
    navStack:'Stack',
    navContact:'Contacto',
    cvDownload:'Descargar CV',
    terminalWhoami:'$ quiensoy',
    terminalName:'Francisco Rose Cerna',
    terminalRoleCommand:'$ cat rol.txt',
    terminalRole:'Software Developer y Estudiante de Ingeniería en Sistemas (5º año)',
    terminalLocationCommand:'$ cat ubicacion.txt',
    terminalLocation:'Santa Fe, Argentina',
    terminalPrompt:'$ ',
    heroTag:'Backend · sistemas · arquitectura de software',
    heroDescription:'Construyo servidores, motores y APIs desde cero para entender cómo funcionan por dentro, no solo para usarlos. C#, C++ y TypeScript son mis herramientas principales.',
    projectsTitle:'Proyectos',
    miniHttp1:'Servidor HTTP/1.1 desarrollado desde cero utilizando sockets nativos.',
    miniHttp2:'Arquitectura modular basada en request/response y middleware chain.',
    miniHttp3:'Compatibilidad Windows/POSIX y gestión explícita de conexiones y recursos.',
    myRegex1:'Motor de expresiones regulares desarrollado desde cero, sin System.Text.RegularExpressions.',
    myRegex2:'AST modular con soporte para cuantificadores, grupos, alternaciones, clases de caracteres y lookaround.',
    myRegex3:'Implementación de backtracking y operaciones IsMatch, Match, Replace, Split y búsqueda de patrones.',
    miniX1:'API REST con autenticación JWT, refresh tokens y autorización.',
    miniX2:'Funcionalidades de publicaciones, comentarios, follows y búsqueda.',
    miniX3:'Rate limiting, subida de imágenes y arquitectura modular.',
    market1:'Sistema de inventario, compras, ventas, usuarios y permisos.',
    market2:'Repository pattern, dependency injection y control de concurrencia optimista.',
    market3:'Transacciones ACID y sistema de auditoría.',
    educationTitle:'Educación',
    degree:'Ingeniería en Sistemas',
    university:'Universidad Abierta Interamericana',
    fce:'First Certificate in English (FCE)',
    cambridge:'Cambridge Nivel B2',
    technologiesTitle:'Tecnologías',
    languagesLabel:'Lenguajes',
    frameworksLabel:'Frameworks y librerías',
    databasesLabel:'Bases de datos',
    architectureLabel:'Arquitectura y conceptos',
    toolsLabel:'Herramientas',
    spokenLanguagesLabel:'Idiomas',
    spanish:'Español',
    native:'Nativo',
    english:'Inglés',
    contactTitle:'¿Un proyecto backend en mente? Hablemos.',
    skipToContent:'Saltar al contenido',
    pageTitle:'Francisco Rose Cerna — Software Developer',
    metaDescription:'Francisco Rose Cerna, desarrollador backend y estudiante de Ingeniería en Sistemas en Santa Fe, Argentina. Construyo servidores, motores y APIs desde cero en C#, C++ y TypeScript.',
    socialDescription:'Backend, sistemas y arquitectura de software. Servidores, motores y APIs construidos desde cero en C#, C++ y TypeScript.',
    locale:'es_AR'
  },
  en: {
    period:'2022 - 2026/2027 (expected) 5th year',
    marketTitle:'Supermarket Management System',
    miniXTitle:'MiniX — social network',
    myRegexTitle:'MyRegex — regular expression engine',
    miniHttpTitle:'MiniHTTP — HTTP server from scratch',
    navProjects:'Projects',
    navStack:'Stack',
    navContact:'Contact',
    cvDownload:'Download CV',
    terminalWhoami:'$ whoami',
    terminalName:'Francisco Rose Cerna',
    terminalRoleCommand:'$ cat role.txt',
    terminalRole:'Software Developer and Systems Engineering student (5th year)',
    terminalLocationCommand:'$ cat location.txt',
    terminalLocation:'Santa Fe, Argentina',
    terminalPrompt:'$ ',
    heroTag:'Backend · systems · software architecture',
    heroDescription:'I build servers, engines, and APIs from scratch to understand how they work inside, not just how to use them. C#, C++, and TypeScript are my main tools.',
    projectsTitle:'Projects',
    miniHttp1:'HTTP/1.1 server built from scratch using native sockets.',
    miniHttp2:'Modular architecture based on request/response and a middleware chain.',
    miniHttp3:'Windows/POSIX compatibility with explicit connection and resource management.',
    myRegex1:'Regular expression engine built from scratch, without System.Text.RegularExpressions.',
    myRegex2:'Modular AST supporting quantifiers, groups, alternations, character classes, and lookaround.',
    myRegex3:'Backtracking implementation with IsMatch, Match, Replace, Split, and pattern search operations.',
    miniX1:'REST API with JWT authentication, refresh tokens, and authorization.',
    miniX2:'Posts, comments, follows, and search functionality.',
    miniX3:'Rate limiting, image uploads, and modular architecture.',
    market1:'Inventory, purchasing, sales, users, and permissions system.',
    market2:'Repository pattern, dependency injection, and optimistic concurrency control.',
    market3:'ACID transactions and audit system.',
    educationTitle:'Education',
    degree:'Systems Engineering',
    university:'Universidad Abierta Interamericana',
    fce:'First Certificate in English (FCE)',
    cambridge:'Cambridge B2 Level',
    technologiesTitle:'Technologies',
    languagesLabel:'Languages',
    frameworksLabel:'Frameworks and libraries',
    databasesLabel:'Databases',
    architectureLabel:'Architecture and concepts',
    toolsLabel:'Tools',
    spokenLanguagesLabel:'Languages',
    spanish:'Spanish',
    native:'Native',
    english:'English',
    contactTitle:'Have a backend project in mind? Lets talk.',
    skipToContent:'Skip to content',
    pageTitle:'Francisco Rose Cerna — Software Developer',
    metaDescription:'Francisco Rose Cerna, backend developer and Systems Engineering student in Santa Fe, Argentina. I build servers, engines, and APIs from scratch in C#, C++, and TypeScript.',
    socialDescription:'Backend, systems, and software architecture. Servers, engines, and APIs built from scratch in C#, C++, and TypeScript.',
    locale:'en_US'
  }
};

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('site-language');
  if (savedLanguage === 'es' || savedLanguage === 'en') return savedLanguage;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
};

let currentLanguage = getInitialLanguage();

const updateMetaTags = (language) => {
  const t = translations[language];

  document.title = t.pageTitle;

  const setAttr = (id, attr, value) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  };

  setAttr('meta-description', 'content', t.metaDescription);
  setAttr('og-title', 'content', t.pageTitle);
  setAttr('og-description', 'content', t.socialDescription);
  setAttr('og-locale', 'content', t.locale);
  setAttr('twitter-title', 'content', t.pageTitle);
  setAttr('twitter-description', 'content', t.socialDescription);
};

const applyLanguage = (language) => {
  currentLanguage = language;
  document.documentElement.lang = language;
  updateMetaTags(language);

  const wasReady = terminalReady;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const text = translations[language][element.dataset.i18n];

    if (element.classList.contains('terminal-line')) {
      element.dataset.text = text;

      if (wasReady) {
        const cursor = element.querySelector('.cursor');
        element.textContent = text;
        if (cursor) element.appendChild(cursor);
      }
    } else {
      element.textContent = text;
    }
  });

  if (!wasReady) {
    restartTerminalAnimation();
  }

  if (cvLink) {
    cvLink.href = language === 'es'
      ? 'https://docs.google.com/document/d/1AI45_KIOIz-lhY3GVzImKwg7aII7hjpHffgZKOReqqs/export?format=pdf'
      : 'https://docs.google.com/document/d/15-olD69gPF3bbUwcRdsNkuK7XySvQUJjD1J5hAGsORs/export?format=pdf';
    cvLink.setAttribute('download', language === 'es' ? 'Francisco-Rose-Cerna-CV-ES.pdf' : 'Francisco-Rose-Cerna-CV-EN.pdf');
  }

  languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
  languageToggle.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
  languageToggle.title = language === 'es' ? 'Switch to English' : 'Cambiar a español';
  localStorage.setItem('site-language', language);
};

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const getRoleAnimationParts = (language) => {
  const finalText = translations[language].terminalRole;

  if (language === 'es') {
    return {
      prefix: 'Software Developer y',
      temporaryText: ' creador de bugs a tiempo completo',
      suffix: ' Estudiante de Ingeniería en Sistemas (5º año)',
      finalText
    };
  }

  return {
    prefix: 'Software Developer and',
    temporaryText: ' full-time bug manufacturer',
    suffix: ' Systems Engineering student (5th year)',
    finalText
  };
};

const typeLine = async (line, runId) => {
  const text = line.dataset.text || '';
  line.textContent = '';
  line.style.visibility = 'visible';

  if (line.dataset.i18n === 'terminalRole') {
    const { prefix, temporaryText, suffix } = getRoleAnimationParts(currentLanguage);

    for (const character of prefix) {
      if (runId !== animationRun) return;
      line.textContent += character;
      await wait(typingSpeed);
    }

    for (const character of temporaryText) {
      if (runId !== animationRun) return;
      line.textContent += character;
      await wait(typingSpeed);
    }

    if (runId !== animationRun) return;
    await wait(typingSpeed * 10);

    for (let index = temporaryText.length; index > 0; index--) {
      if (runId !== animationRun) return;
      line.textContent = line.textContent.slice(0, -1);
      await wait(typingSpeed * 0.6);
    }

    for (const character of suffix) {
      if (runId !== animationRun) return;
      line.textContent += character;
      await wait(typingSpeed);
    }

    return;
  }

  for (const character of text) {
    if (runId !== animationRun) return;
    line.textContent += character;
    await wait(typingSpeed);
  }
};

const showTerminal = async () => {
  const runId = ++animationRun;
  terminalReady = false;

  for (const [index, line] of [...terminalLines].entries()) {
    await typeLine(line, runId);
    if (runId !== animationRun) return;
    if (index < terminalLines.length - 1) {
      await wait(linePause);
    }
  }

  if (runId !== animationRun) return;

  const finalLine = terminalLines[terminalLines.length - 1];
  const existingCursor = finalLine.querySelector('.cursor');
  if (existingCursor) existingCursor.remove();
  finalLine.append(document.createElement('span'));
  finalLine.lastElementChild.className = 'cursor';
  terminalReady = true;
};

const restartTerminalAnimation = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showTerminalImmediately();
    return;
  }
  showTerminal();
};

const showTerminalImmediately = () => {
  ++animationRun;
  terminalLines.forEach((line, index) => {
    const existingCursor = line.querySelector('.cursor');
    if (existingCursor) existingCursor.remove();
    line.textContent = line.dataset.text || '';
    if (index === terminalLines.length - 1) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      line.append(cursor);
    }
  });
  terminalReady = true;
};

applyLanguage(currentLanguage);
languageToggle.addEventListener('click', () => applyLanguage(currentLanguage === 'es' ? 'en' : 'es'));