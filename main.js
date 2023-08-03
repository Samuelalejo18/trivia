document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("categorySelect");
  const difficultySelect = document.getElementById("difficultySelect");
  const typeSelect = document.getElementById("typeSelect");
  const startButton = document.getElementById("startButton");
  const triviaContainer = document.getElementById("triviaContainer");
  const scoreDisplay = document.getElementById("score");

  let triviaData = [];
  let currentQuestion = 0;
  let score = 0;

  // Función para cargar categorías desde la API
  function loadCategories() {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        data.trivia_categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      });
  }

  // Función para cargar trivias desde la API según los parámetros seleccionados
  function loadTrivia() {
    const categoryId = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;

    fetch(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=${type}`
    )
      .then((response) => response.json())
      .then((data) => {
        triviaData = data.results;
        currentQuestion = 0;
        score = 0;
        scoreDisplay.textContent = score;
        showQuestion();
      });
  }

  // Función para mostrar una pregunta y sus respuestas
  function showQuestion() {
    const question = triviaData[currentQuestion];
    const answers = shuffle([
      ...question.incorrect_answers,
      question.correct_answer,
    ]);

    const questionHTML = `
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">${question.question}</h4>
          <ul class="list-group">
            ${answers
              .map(
                (answer) =>
                  `<li class="list-group-item">${answer}</li>`
              )
              .join("")}
          </ul>
        </div>
      </div>
    `;

    triviaContainer.innerHTML = questionHTML;

    // Agregar evento de clic a las respuestas
    const answerItems = document.querySelectorAll(".list-group-item");
    answerItems.forEach((item) => {
      item.addEventListener("click", () => checkAnswer(item.textContent));
    });
  }

  // Función para verificar si la respuesta es correcta y mostrar la siguiente pregunta
  function checkAnswer(selectedAnswer) {
    const correctAnswer = triviaData[currentQuestion].correct_answer;
    if (selectedAnswer === correctAnswer) {
      score += 100;
      scoreDisplay.textContent = score;
    }
    currentQuestion++;

    if (currentQuestion < triviaData.length) {
      showQuestion();
    } else {
      triviaContainer.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Trivias terminadas. Puntaje final: ${score}</h4>
          </div>
        </div>
      `;
    }
  }

  // Función para mezclar un array
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Evento de clic en el botón de comenzar trivia
  startButton.addEventListener("click", loadTrivia);

  // Cargar las categorías al cargar la página
  loadCategories();
});
