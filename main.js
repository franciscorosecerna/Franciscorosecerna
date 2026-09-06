const terminalLines = document.querySelectorAll('.terminal-line');
const typingSpeed = 30;
const linePause = 300;

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const typeLine = async (line) => {
  const text = line.dataset.text || '';
  line.textContent = '';

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
};

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  showTerminalImmediately();
} else {
  showTerminal();
}