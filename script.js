const sections = ['plazos', 'mayorias', 'mandatos', 'leyes'];
let currentSectionIndex = 0;
let currentData = [];

const sectionTitle = document.getElementById('section-title');
const quizContainer = document.getElementById('quiz-container');
const nextBtn = document.getElementById('next-btn');

async function loadSection(section) {
  const response = await fetch(`${section}.json`);
  currentData = await response.json();
  sectionTitle.textContent = section.toUpperCase();
  renderQuestions();
}

function renderQuestions() {
  quizContainer.innerHTML = '';
  nextBtn.disabled = true;

  const questions = shuffle(currentData).slice(0, 3);
  questions.forEach((pair, index) => {
    const div = document.createElement('div');
    div.classList.add('question-pair');

    const label = document.createElement('span');
    label.textContent = pair.left;

    const select = document.createElement('select');
    select.dataset.answer = pair.right;

    const options = shuffle(currentData.map(p => p.right));
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    select.addEventListener('change', checkAnswers);

    div.appendChild(label);
    div.appendChild(select);
    quizContainer.appendChild(div);
  });
}

function checkAnswers() {
  let allCorrect = true;
  const selects = document.querySelectorAll('select');

  selects.forEach(select => {
    const correct = select.dataset.answer;
    const selected = select.value;
    select.classList.remove('correct', 'incorrect');
    if (selected === correct) {
      select.classList.add('correct');
    } else {
      select.classList.add('incorrect');
      allCorrect = false;
    }
  });

  nextBtn.disabled = !allCorrect;
}

nextBtn.addEventListener('click', () => {
  currentSectionIndex++;
  if (currentSectionIndex < sections.length) {
    loadSection(sections[currentSectionIndex]);
  } else {
    sectionTitle.textContent = '¡Quiz Completado!';
    quizContainer.innerHTML = '<p>¡Buen trabajo! Has terminado todas las secciones.</p>';
    nextBtn.style.display = 'none';
  }
});

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

loadSection(sections[currentSectionIndex]);
