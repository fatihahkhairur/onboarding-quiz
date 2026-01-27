// DOM = Document Object Model
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const quizImage = document.getElementById("quiz-animation");
const buttonContainer = document.querySelector('.button-container');

// Quiz questions
const quizQuestions = [
  {
    question: "It’s your first day at a new job. What’s the most realistic move?",
    image: "images/q1.png",
    answers: [
      { text: "Go through orientation & setup", correct: true },
      { text: "Jump straight into real work", correct: false },
      { text: "Sit quietly and wait", correct: false },
      { text: "Count down to clock-out time", correct: false },
    ],
  },
  {
    question: "You’re confused about a task. Who’s the best person to ask?",
    image: "images/q2.png",
    answers: [
      { text: "Your friends", correct: false },
      { text: "HR or your supervisor", correct: true },
      { text: "A random colleague", correct: false },
      { text: "Refer on TikTok", correct: false },
    ],
  },
  {
    question: "Company policies exist to…",
    image: "images/q3.png",
    answers: [
      { text: "Make life harder", correct: false },
      { text: "Control everyone", correct: false },
      { text: "Test your patience", correct: false },
      { text: "Guide how things work", correct: true },
    ],
  },
  {
    question: "Which behaviour fits best in a new workplace?",
    image: "images/q4.png",
    answers: [
      { text: "Arriving whenever", correct: false },
      { text: "Talking the same way you text", correct: false },
      { text: "Staying professional", correct: true },
      { text: "Ignoring guidelines", correct: false },
    ],
  },
  {
    question: "You made a small mistake during your first week. What now?",
    image: "images/q5.png",
    answers: [
      { text: "Pretend it didn’t happen", correct: false },
      { text: "Blame the system", correct: false },
      { text: "Inform your supervisor", correct: true },
      { text: "Panic internally forever", correct: false },
    ],
  },
];


function updateButtons(state) {
  if (state === "start") {
    startButton.style.display = "inline-block";
    restartButton.style.display = "none";
  }

  if (state === "quiz") {
    startButton.style.display = "none";
    restartButton.style.display = "none";
  }

  if (state === "result") {
    startButton.style.display = "none";
    restartButton.style.display = "inline-block";
  }
}


// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  resultScreen.classList.remove("active");

  updateButtons("quiz");

  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  quizImage.src = currentQuestion.image;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");

    // what is dataset? it's a property of the button element that allows you to store custom data
    button.dataset.correct = answer.correct;

    button.addEventListener("click", selectAnswer);

    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;

  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // Here Array.from() is used to convert the NodeList returned by answersContainer.children into an array, this is because the NodeList is not an array and we need to use the forEach method
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;

    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  updateButtons("result");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultTitle.textContent = "Smooth Starter!";
    resultMessage.textContent =
    "You understand the vibes! First weeks are for learning and observing.";
  } else if (percentage >= 80) {
    resultTitle.textContent = "Settling In Nicely!";
    resultMessage.textContent =
    "Looking good! A few questions here and there, but that’s totally fine.";
  } else if (percentage >= 60) {
    resultTitle.textContent = "Classic New Hire!";
    resultMessage.textContent =
    "Totally normal. Everyone starts here. The learning curve is part of the journey.";
  } else if (percentage >= 40) {
    resultTitle.textContent = "Still Warming Up!";
    resultMessage.textContent =
    "New environments can be confusing. Slow down, ask questions, and breathe.";  
  } else {
    resultTitle.textContent = "First-Week Overwhelm Club!";
    resultMessage.textContent =
    "Deep breath. Every confident employee once felt this way. You’re not alone.";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  startScreen.classList.add("active");

  updateButtons("start");
}