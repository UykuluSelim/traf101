// Traffic Signs Data
const trafficSigns = [
    {
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cpolygon points="100,20 180,180 20,180" fill="%23FF0000" stroke="%23FFF" stroke-width="8"/%3E%3Ctext x="100" y="140" font-size="60" fill="white" text-anchor="middle" font-weight="bold"%3ESTOP%3C/text%3E%3C/svg%3E',
        question: 'What does this sign mean?',
        choices: ['Stop', 'Yield', 'Go', 'Slow Down'],
        correctAnswer: 'Stop'
    },
    {
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cpolygon points="100,20 180,100 100,180 20,100" fill="%23FFD700" stroke="%23000" stroke-width="6"/%3E%3Ctext x="100" y="120" font-size="45" fill="black" text-anchor="middle" font-weight="bold"%3EYIELD%3C/text%3E%3C/svg%3E',
        question: 'What does this sign mean?',
        choices: ['Merge', 'Yield', 'Stop', 'Do Not Enter'],
        correctAnswer: 'Yield'
    },
    {
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ccircle cx="100" cy="100" r="80" fill="white" stroke="%23FF0000" stroke-width="12"/%3E%3Ctext x="100" y="130" font-size="70" fill="black" text-anchor="middle" font-weight="bold"%3E50%3C/text%3E%3C/svg%3E',
        question: 'What is the maximum speed allowed?',
        choices: ['40 mph', '60 mph', '50 mph', '30 mph'],
        correctAnswer: '50 mph'
    },
    {
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ccircle cx="100" cy="100" r="80" fill="white" stroke="%23FF0000" stroke-width="12"/%3E%3Ctext x="100" y="90" font-size="45" fill="red" text-anchor="middle" font-weight="bold"%3ENO%3C/text%3E%3Ctext x="100" y="140" font-size="40" fill="red" text-anchor="middle" font-weight="bold"%3EPARKING%3C/text%3E%3C/svg%3E',
        question: 'What is prohibited here?',
        choices: ['No Entry', 'No U-Turn', 'No Parking', 'No Stopping'],
        correctAnswer: 'No Parking'
    },
    {
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect x="20" y="20" width="160" height="160" fill="%23FFD700" stroke="%23000" stroke-width="6"/%3E%3Ctext x="100" y="80" font-size="35" fill="black" text-anchor="middle" font-weight="bold"%3ESCHOOL%3C/text%3E%3Ctext x="100" y="130" font-size="35" fill="black" text-anchor="middle" font-weight="bold"%3EZONE%3C/text%3E%3C/svg%3E',
        question: 'What should you watch out for?',
        choices: ['Hospital Ahead', 'Children Crossing', 'Playground Area', 'Library'],
        correctAnswer: 'Children Crossing'
    }
];

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const signImage = document.getElementById('sign-image');
const choicesList = document.getElementById('choices-list');
const feedbackDiv = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const scoreSpan = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');

// Game State Variables
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', function() {
    currentQuestionIndex++;
    loadQuestion();
});

// Initialize theme on page load
initTheme();

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Initialize and start the quiz game
 */
function startGame() {
    startBtn.classList.add('hide');
    quizArea.classList.remove('hide');
    progressBar.classList.remove('hide');
    
    score = 0;
    currentQuestionIndex = 0;
    scoreSpan.textContent = score;
    
    shuffledQuestions = shuffle(trafficSigns);
    loadQuestion();
}

/**
 * Load the current question and display choices
 */
function loadQuestion() {
    resetState();
    
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGame();
        return;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    
    signImage.src = currentQuestion.image;
    signImage.alt = currentQuestion.correctAnswer;
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    currentQuestion.choices.forEach(function(choice) {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', selectAnswer);
        choicesList.appendChild(li);
    });
}

/**
 * Reset the quiz state for the next question
 */
function resetState() {
    feedbackDiv.textContent = '';
    nextBtn.classList.add('hide');
    
    while (choicesList.firstChild) {
        choicesList.removeChild(choicesList.firstChild);
    }
}

/**
 * Handle answer selection and provide feedback
 */
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.textContent === shuffledQuestions[currentQuestionIndex].correctAnswer;
    const choiceButtons = document.querySelectorAll('#choices-list li');

    if (correct) {
        score++;
        scoreSpan.textContent = score;
        feedbackDiv.textContent = "✓ Correct!";
        feedbackDiv.style.color = 'var(--correct-color)';
        selectedButton.classList.add('correct');
    } else {
        feedbackDiv.textContent = "✗ Incorrect!";
        feedbackDiv.style.color = 'var(--incorrect-color)';
        selectedButton.classList.add('incorrect');
    }

    choiceButtons.forEach(function(button) {
        if (button.textContent === shuffledQuestions[currentQuestionIndex].correctAnswer) {
            button.classList.add('correct');
        }
        button.style.pointerEvents = 'none';
    });

    nextBtn.classList.remove('hide');
}

/**
 * Display final results and end the game
 */
function endGame() {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = 'Perfect Score! You\'re a Road Safety Expert!';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = 'Great Job! You Know Your Signs Well!';
        emoji = '⭐';
    } else if (percentage >= 60) {
        message = 'Good Effort! Keep Practicing!';
        emoji = '👍';
    } else {
        message = 'Keep Learning! Practice Makes Perfect!';
        emoji = '📚';
    }
    
    quizArea.innerHTML = 
        '<h2>' + emoji + ' Quiz Complete!</h2>' +
        '<p class="final-score">' + score + ' / ' + shuffledQuestions.length + '</p>' +
        '<p class="result-message" style="font-size: 1.2em; margin: 20px 0;">' + message + '</p>' +
        '<p style="font-size: 1.1em; margin: 15px 0;">Accuracy: ' + percentage + '%</p>' +
        '<button class="btn-primary" onclick="location.reload()" style="margin-top: 25px;">Play Again</button>';
    
    progressBar.classList.add('hide');
}
