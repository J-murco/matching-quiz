let data = {};
let currentSection = 0;
let currentIndex = 0;
const questionsPerPage = 3;
const sectionOrder = ["PLAZOS", "MAYORIAS", "MANDATOS", "LEYES"];

async function loadJSON() {
  for (let section of sectionOrder) {
    const res = await fetch(`${section}.json`);
    data[section] = await res.json();
  }
  loadSection();
}

function loadSection() {
  const section = sectionOrder[currentSection];
  document.getElementById("section-title").innerText = section;
  currentIndex = 0;
  showQuestions();
}

function showQuestions() {
  const section = sectionOrder[currentSection];
  const container = document.getElementById("quiz-container");
  const subset = data[section].slice(currentIndex, currentIndex + questionsPerPage);

  container.innerHTML = "";
  const leftColumn = document.createElement("div");
  leftColumn.className = "column";
  const rightColumn = document.createElement("div");
  rightColumn.className = "column";

  subset.forEach((pair, i) => {
    const left = document.createElement("div");
    left.innerText = pair.left;
    leftColumn.appendChild(left);

    const select = document.createElement("select");
    select.className = "select";
    select.dataset.correct = pair.right;
    select.innerHTML = `<option value="">Select</option>` +
      shuffle(subset.map(p => `<option value="${p.right}">${p.right}</option>`)).join('');
    select.addEventListener("change", checkAnswers);
    rightColumn.appendChild(select);
  });

  container.appendChild(leftColumn);
  container.appendChild(rightColumn);
  document.getElementById("message").innerText = "";
  document.getElementById("next-btn").style.display = "none";
}

function checkAnswers() {
  const selects = document.querySelectorAll(".select");
  let allCorrect = true;
  selects.forEach(select => {
    if (select.value !== select.dataset.correct) {
      allCorrect = false;
    }
  });
  if (allCorrect) {
    document.getElementById("message").innerText = "Correct!";
    document.getElementById("next-btn").style.display = "inline-block";
  } else {
    document.getElementById("message").innerText = "Keep trying...";
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex += questionsPerPage;
  const section = sectionOrder[currentSection];
  if (currentIndex >= data[section].length) {
    currentSection++;
    if (currentSection >= sectionOrder.length) {
      document.getElementById("quiz-container").innerHTML = "Quiz complete!";
      document.getElementById("section-title").innerText = "Well done!";
      document.getElementById("next-btn").style.display = "none";
    } else {
      loadSection();
    }
  } else {
    showQuestions();
  }
});

loadJSON();

