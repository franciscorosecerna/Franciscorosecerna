const terminalLines = document.querySelectorAll('.terminal-line');
const languageToggle = document.querySelector('.language-toggle');
const typingSpeed = 30;
const linePause = 300;
let terminalReady = false;

const translations = {
  es: {
    navProjects:'Proyectos',
    navStack:'Stack',
    navContact:'Contacto',
    terminalWhoami:'$ whoami',
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
    contactTitle:'¿Un proyecto backend en mente? Hablemos.'
  },
  en: {
    navProjects:'Projects',
    navStack:'Stack',
    navContact:'Contact',
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
    contactTitle:'Have a backend project in mind? Lets talk.'
  }
};

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('site-language');
  if (savedLanguage === 'es' || savedLanguage === 'en') return savedLanguage;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
};

let currentLanguage = getInitialLanguage();

const applyLanguage = (language) => {
  currentLanguage = language;
  document.documentElement.lang = language;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const text = translations[language][element.dataset.i18n];

    if (element.classList.contains('terminal-line')) {
      element.dataset.text = text;

      if (terminalReady) {
        const cursor = element.querySelector('.cursor');
        element.textContent = text;
        if (cursor) element.appendChild(cursor);
      }
    } else {
      element.textContent = text;
    }
  });

  languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
  languageToggle.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
  languageToggle.title = language === 'es' ? 'Switch to English' : 'Cambiar a español';
  localStorage.setItem('site-language', language);
};

applyLanguage(currentLanguage);
languageToggle.addEventListener('click', () => applyLanguage(currentLanguage === 'es' ? 'en' : 'es'));

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const typeLine = async (line) => {
  const text = line.dataset.text || '';
  line.textContent = '';
  line.style.visibility = 'visible';

  for (const character of text) {
    line.textContent += character;
    await wait(typingSpeed);
  }
};

const showTerminal = async () => {
  for (const [index, line] of [...terminalLines].entries()) {
    await typeLine(line);
    if (index < terminalLines.length - 1) {
      await wait(linePause);
    }
  }

  const finalLine = terminalLines[terminalLines.length - 1];
  finalLine.append(document.createElement('span'));
  finalLine.lastElementChild.className = 'cursor';
  terminalReady = true;
};

const showTerminalImmediately = () => {
  terminalLines.forEach((line, index) => {
    line.textContent = line.dataset.text || '';
    if (index === terminalLines.length - 1) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      line.append(cursor);
    }
  });
  terminalReady = true; 
};

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  showTerminalImmediately();
} else {
  showTerminal();
}