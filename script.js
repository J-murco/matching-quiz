const dataFiles = {
  plazos: [
    { left: "Congreso responde estado de alarma", right: "15 días" },
    { left: "Gobierno solicita prórroga estado de alarma", right: "Antes de que expire el plazo anterior" },
    { left: "Comparecencia ante Congreso estado de excepción", right: "Inmediatamente" },
    { left: "Congreso autoriza estado de excepción", right: "30 días" },
    { left: "Prórroga estado de excepción", right: "30 días" },
    { left: "Duración estado de sitio", right: "La que establezca el Congreso" }
  ],
  mayorias: [
    { left: "Estado de alarma", right: "Mayoría simple del Congreso" },
    { left: "Estado de excepción", right: "Mayoría simple del Congreso" },
    { left: "Estado de sitio", right: "Mayoría absoluta del Congreso, a propuesta exclusiva del Gobierno" }
  ],
  mandatos: [
    { left: "Duración del estado de alarma", right: "15 días, prorrogables" },
    { left: "Duración del estado de excepción", right: "30 días, prorrogables" },
    { left: "Duración del estado de sitio", right: "La que establezca el Congreso" }
  ],
  leyes: [
    { left: "Artículo 4.1", right: "El Gobierno podrá declarar el estado de alarma en todo o parte del territorio nacional" },
    { left: "Artículo 13.1", right: "El estado de excepción será declarado por el Gobierno mediante decreto acordado en Consejo de Ministros, previa autorización del Congreso de los Diputados" },
    { left: "Artículo 32", right: "El estado de sitio será declarado por la mayoría absoluta del Congreso, a propuesta exclusiva del Gobierno" }
  ]
};

const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');
const categorySelect = document.getElementById('category');
categorySelect.disabled = true;

let selectedLeft = null;
let selectedRight = null;
let matchedPairs = [];
let currentData = [];
let allCategories = Object.keys(dataFiles);
let currentCategoryIndex = 0;
let currentSetIndex = 0;

function shuffleArray(arr) {
  return arr.map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
}

function renderGame(data) {
  leftColumn.innerHTML = '';
  rightColumn.innerHTML = '';
  matchedPairs = [];
  selectedLeft = null;
  selectedRight = null;
  currentData = data;

  const subset = data.slice(currentSetIndex * 3, currentSetIndex * 3 + 3);
  const leftItems = shuffleArray([...subset]);
  const rightItems = shuffleArray([...subset]);

  leftItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = item.left;
    div.addEventListener('click', () => selectItem(div, item, 'left'));
    leftColumn.appendChild(div);
  });

  rightItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = item.right;
    div.addEventListener('click', () => selectItem(div, item, 'right'));
    rightColumn.appendChild(div);
  });
}

function selectItem(div, item, side) {
  if (side === 'left') {
    if (selectedLeft) selectedLeft.div.classList.remove('selected');
    selectedLeft = { div, item };
  } else {
    if (selectedRight) selectedRight.div.classList.remove('selected');
    selectedRight = { div, item };
  }
  div.classList.add('selected');

  if (selectedLeft && selectedRight) {
    if (selectedLeft.item.right === selectedRight.item.right) {
      selectedLeft.div.classList.add('matched');
      selectedRight.div.classList.add('matched');
      matchedPairs.push(selectedLeft.item);
    }
    selectedLeft.div.classList.remove('selected');
    selectedRight.div.classList.remove('selected');
    selectedLeft = null;
    selectedRight = null;
  }
}

function checkAnswers() {
  const resultDisplay = document.getElementById('result');
  const matchedCount = matchedPairs.length;
  if (matchedCount === 3) {
    resultDisplay.textContent = "✅ Perfect! Moving to next set...";
    setTimeout(() => {
      currentSetIndex++;
      const categoryData = dataFiles[allCategories[currentCategoryIndex]];
      if (currentSetIndex * 3 < categoryData.length) {
        renderGame(categoryData);
      } else {
        currentCategoryIndex++;
        currentSetIndex = 0;
        if (currentCategoryIndex < allCategories.length) {
          renderGame(dataFiles[allCategories[currentCategoryIndex]]);
        } else {
          resultDisplay.textContent = "🎉 You've completed all categories!";
          leftColumn.innerHTML = '';
          rightColumn.innerHTML = '';
        }
      }
    }, 1000);
  } else {
    resultDisplay.textContent = `You matched ${matchedCount} out of 3. Try again!`;
  }
}

document.body.insertAdjacentHTML('beforeend', `
  <div style="text-align: center; margin-top: 20px;">
    <button id="check-answers">Check Answers</button>
    <p id="result"></p>
  </div>
`);

document.getElementById('check-answers').addEventListener('click', checkAnswers);

// Initial load
renderGame(dataFiles[allCategories[currentCategoryIndex]]);

  }
});

loadJSON();

