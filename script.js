const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = 500;

let text = '';
let x = 50;
let y = 50;
let fontColor = '#000000';
let fontSize = 16;
let fontFamily = 'Arial';
let textHistory = [];
let historyStep = -1;
let isDragging = false;
let offsetX, offsetY;

function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.fillText(text, x, y);
}

function saveHistory() {
  textHistory = textHistory.slice(0, historyStep + 1); 
  textHistory.push({ text, x, y, fontColor, fontSize, fontFamily });
  historyStep++;
}

canvas.addEventListener('click', (e) => {
  if (!text) {
    text = prompt('Enter your text:');
    saveHistory();
    drawText();
  }
});

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;

  const textWidth = ctx.measureText(text).width;
  const textHeight = fontSize;

  if (mouseX >= x && mouseX <= x + textWidth && mouseY >= y - textHeight && mouseY <= y) {
    isDragging = true;
    offsetX = mouseX - x;
    offsetY = mouseY - y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    x = e.clientX - canvas.offsetLeft - offsetX;
    y = e.clientY - canvas.offsetTop - offsetY;
    drawText();
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    saveHistory();
  }
});

document.getElementById('font-color').addEventListener('input', (e) => {
  fontColor = e.target.value;
  drawText();
  saveHistory();
});

document.getElementById('font-size').addEventListener('input', (e) => {
  fontSize = parseInt(e.target.value);
  drawText();
  saveHistory();
});

document.getElementById('font-family').addEventListener('change', (e) => {
  fontFamily = e.target.value;
  drawText();
  saveHistory();
});

document.getElementById('undo').addEventListener('click', () => {
  if (historyStep > 0) {
    historyStep--;
    const { text: oldText, x: oldX, y: oldY, fontColor: oldColor, fontSize: oldSize, fontFamily: oldFamily } = textHistory[historyStep];
    text = oldText;
    x = oldX;
    y = oldY;
    fontColor = oldColor;
    fontSize = oldSize;
    fontFamily = oldFamily;
    drawText();
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (historyStep < textHistory.length - 1) {
    historyStep++;
    const { text: redoText, x: redoX, y: redoY, fontColor: redoColor, fontSize: redoSize, fontFamily: redoFamily } = textHistory[historyStep];
    text = redoText;
    x = redoX;
    y = redoY;
    fontColor = redoColor;
    fontSize = redoSize;
    fontFamily = redoFamily;
    drawText();
  }
});
