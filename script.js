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
const progressMap = document.getElementById('progress-map');
const progressDots = document.getElementById('progress-dots');
const timerContainer = document.getElementById('timer-container');
const gameContainer = document.getElementById('game-container');

// Game State Variables
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
let timerInterval;
let timeLeft = 30;
let questionResults = [];
let audioContext;

// Initialize Audio Context on user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Effects
function playCorrectSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 659.25; // E5
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
    }, 150);
}

function playIncorrectSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
}

// Create animated background
function createTrafficEmojis() {
    const emojis = ['🚗', '🚙', '🚕', '🚌', '🚎', '🏍️', '🚲', '🛴', '🚦', '🚥', '⛽', '🅿️', '🚧', '⚠️'];
    const body = document.body;
    
    for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'traffic-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';
        emoji.style.animationDelay = Math.random() * 20 + 's';
        emoji.style.animationDuration = (15 + Math.random() * 10) + 's';
        body.appendChild(emoji);
    }
}

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

// Timer functions
function startTimer() {
    timeLeft = 30;
    timerContainer.textContent = timeLeft;
    timerContainer.classList.remove('warning');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerContainer.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerContainer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerContainer.classList.remove('warning');
}

function handleTimeout() {
    questionResults.push(false);
    updateProgressMap();
    
    // Fall animation
    gameContainer.classList.add('fall');
    const allEmojis = document.querySelectorAll('.traffic-emoji');
    allEmojis.forEach(emoji => {
        emoji.style.animation = 'fall 1s ease-in forwards';
        emoji.style.animationDelay = Math.random() * 0.3 + 's';
    });
    
    setTimeout(() => {
        gameContainer.classList.remove('fall');
        // Reset emoji animations
        allEmojis.forEach(emoji => {
            emoji.style.animation = '';
            const duration = (15 + Math.random() * 10) + 's';
            emoji.style.animation = `float ${duration} infinite`;
        });
        
        currentQuestionIndex++;
        if (currentQuestionIndex >= shuffledQuestions.length) {
            endGame();
        } else {
            loadQuestion();
        }
    }, 1000);
}

// Progress map functions
function initProgressMap() {
    progressDots.innerHTML = '';
    for (let i = 0; i < shuffledQuestions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.textContent = i + 1;
        progressDots.appendChild(dot);
    }
    updateProgressMap();
}

function updateProgressMap() {
    const dots = progressDots.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'completed', 'failed');
        if (index < currentQuestionIndex) {
            if (questionResults[index]) {
                dot.classList.add('completed');
            } else {
                dot.classList.add('failed');
            }
        } else if (index === currentQuestionIndex) {
            dot.classList.add('current');
        }
    });
}

// Shuffle array
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Start Game
function startGame() {
    initAudioContext(); // Initialize audio on user interaction
    gameContainer.classList.add('fade-out');
    
    setTimeout(() => {
        startBtn.classList.add('hide');
        quizArea.classList.remove('hide');
        progressBar.classList.remove('hide');
        progressMap.classList.remove('hide');
        timerContainer.classList.remove('hide');
        
        score = 0;
        currentQuestionIndex = 0;
        questionResults = [];
        scoreSpan.textContent = score;
        
        shuffledQuestions = shuffle(trafficSigns);
        initProgressMap();
        gameContainer.classList.remove('fade-out');
        loadQuestion();
    }, 500);
}

// Load Question
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
    
    updateProgressMap();
    startTimer();
}

// Reset State
function resetState() {
    stopTimer();
    feedbackDiv.textContent = '';
    nextBtn.classList.add('hide');
    
    while (choicesList.firstChild) {
        choicesList.removeChild(choicesList.firstChild);
    }
}

// Select Answer
function selectAnswer(e) {
    stopTimer();
    const selectedButton = e.target;
    const correct = selectedButton.textContent === shuffledQuestions[currentQuestionIndex].correctAnswer;
    const choiceButtons = document.querySelectorAll('#choices-list li');

    if (correct) {
        score++;
        scoreSpan.textContent = score;
        feedbackDiv.textContent = "✓ Correct!";
        feedbackDiv.style.color = 'var(--correct-color)';
        selectedButton.classList.add('correct');
        questionResults.push(true);
        
        // Flash green
        document.body.classList.add('correct-flash');
        playCorrectSound();
        
        setTimeout(() => {
            document.body.classList.remove('correct-flash');
        }, 500);
    } else {
        feedbackDiv.textContent = "✗ Incorrect!";
        feedbackDiv.style.color = 'var(--incorrect-color)';
        selectedButton.classList.add('incorrect');
        questionResults.push(false);
        
        // Flash red
        document.body.classList.add('incorrect-flash');
        playIncorrectSound();
        
        setTimeout(() => {
            document.body.classList.remove('incorrect-flash');
        }, 500);
    }

    choiceButtons.forEach(function(button) {
        if (button.textContent === shuffledQuestions[currentQuestionIndex].correctAnswer) {
            button.classList.add('correct');
        }
        button.style.pointerEvents = 'none';
    });

    updateProgressMap();
    nextBtn.classList.remove('hide');
}

// End Game
function endGame() {
    stopTimer();
    timerContainer.classList.add('hide');
    progressMap.classList.add('hide');
    
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

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', function() {
    gameContainer.classList.add('fade-out');
    setTimeout(() => {
        currentQuestionIndex++;
        gameContainer.classList.remove('fade-out');
        loadQuestion();
    }, 500);
});

// Initialize on page load
initTheme();
createTrafficEmojis();
