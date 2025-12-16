// Traffic Signs Data
const trafficSigns = [
    {
        mediaType: 'image',
        videoSource: 'images/SORU 1.jpg',
        question: 'On which side of the road is traffic in Cyprus?',
        choices: ['Right', 'Left', 'Middle', 'Both Sides'],
        correctAnswer: 'Left',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 2.jpg',
        question: 'What is the general speed limit in urban areas in Northern Cyprus?',
        choices: ['30 km/h', '50 km/h', '65 km/h', '80 km/h'],
        correctAnswer: '50 km/h',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 3.jpg',
        question: 'According to the right-of-way rule at intersections, which vehicle has priority?',
        choices: ['The one coming from the left', 'The one coming from the right', 'The fastest vehicle', 'The largest vehicle'],
        correctAnswer: 'The one coming from the right',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 4.jpg',
        question: 'Which statement about seat belts is correct?',
        choices: ['Only drivers must wear them', 'They are required only on long trips', 'They are mandatory for all passengers', 'Passengers on the back seat don’t need them'],
        correctAnswer: 'They are mandatory for all passengers',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 5.jpg',
        question: 'What must a driver do when encountering a “STOP” sign?',
        choices: ['Slow down and continue', 'Look only to the right', 'Come to a full stop and check the road', 'Honk the horn'],
        correctAnswer: 'Come to a full stop and check the road',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 6.jpg',
        question: 'What is the minimum tread depth required for vehicle tires?',
        choices: ['1 mm', '1.6 mm', '3 mm', '5 mm'],
        correctAnswer: '1.6 mm',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 7.jpg',
        question: 'When must a driver turn on the vehicle’s headlights?',
        choices: ['On a sunny day', 'When visibility is reduced', 'While waiting in a city center', 'When parked'],
        correctAnswer: 'When visibility is reduced',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 8.jpg',
        question: 'What does the term “blind spot” mean?',
        choices: ['An area where brakes don’t work', 'The area that cannot be seen with mirrors', 'The moment the engine stops', 'A point where the road is empty'],
        correctAnswer: 'The area that cannot be seen with mirrors',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 9.jpg',
        question: 'Which of the following is NOT a type of traffic sign?',
        choices: ['Informational signs', 'Warning signs', 'Advertising billboards', 'Prohibitory signs'],
        correctAnswer: 'Advertising billboards',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 10.jpg',
        question: 'What should a driver do when approaching a school crossing?',
        choices: ['Speed up', 'Honk the horn', 'Slow down and give way to pedestrians', 'Cross quickly'],
        correctAnswer: 'Slow down and give way to pedestrians',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 11.jpg',
        question: 'What is the main purpose of using turn signals?',
        choices: ['To reduce horn use', 'To increase vehicle speed', 'To inform other drivers and pedestrians', 'To stop vehicles on the road'],
        correctAnswer: 'To inform other drivers and pedestrians',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 12.jpg',
        question: 'What do traffic signs with a red color generally indicate?',
        choices: ['Prohibitions and stops', 'Directions', 'Warnings', 'Information'],
        correctAnswer: 'Prohibitions and stops',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 13.jpg',
        question: 'Electronic Stability Control (ESC) helps drivers by:',
        choices: ['Automatically applying brakes when speeding', 'Detecting and reducing loss of traction', 'Improving fuel efficiency', 'Enhancing radio signal reception'],
        correctAnswer: 'Detecting and reducing loss of traction',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 14.jpg',
        question: 'What is the primary purpose of the Anti-lock Braking System (ABS) in modern vehicles?',
        choices: ['To increase the vehicle’s maximum speed', 'To prevent wheels from locking during emergency braking', 'To reduce fuel consumption', 'To improve engine performance'],
        correctAnswer: 'To prevent wheels from locking during emergency braking',
        timeLimit: 30
    },
    {
        mediaType: 'image',
        videoSource: 'images/SORU 15.jpg',
        question: 'Hydroplaning occurs when:',
        choices: ['The vehicle is driven through deep water intentionally', 'Tires lose contact with the road surface due to water buildup', 'The brakes get wet', 'The windshield wipers fail'],
        correctAnswer: 'Tires lose contact with the road surface due to water buildup',
        timeLimit: 30
    }
];

// DOM Elements
const signIframe = document.getElementById('sign-iframe');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const signImage = document.getElementById('sign-image');
// YENİ: Video elementini yakalamak için
const signVideo = document.getElementById('sign-video'); 
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

// Sound Effects (Orijinal koddan alındı)
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

// Create animated background (Orijinal koddan alındı)
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

// Theme Management (Orijinal koddan alındı)
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

// Timer functions (Orijinal koddan alındı)
function startTimer(duration) {
    // Önceki zamanlayıcı varsa temizle
    clearInterval(timerInterval); 
    
    // Gelen süreyi timeLeft değişkenine ata
    timeLeft = duration; 
    
    // Zamanlayıcı konteynerini başlangıç süresiyle güncelle
    timerContainer.textContent = timeLeft;
    
    // Uyarı sınıfını temizle (başlangıçta yeşil/normal olmalı)
    timerContainer.classList.remove('warning');
    
    // Zamanlayıcıyı başlat
    timerInterval = setInterval(() => {
        timeLeft--;
        timerContainer.textContent = timeLeft;
        
        // Kalan süre 10 saniyenin altındaysa uyarı stilini uygula
        if (timeLeft <= 10) {
            timerContainer.classList.add('warning');
        }
        
        // Süre biterse
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000); // 1 saniyede bir güncelle
}

function stopTimer() {
    clearInterval(timerInterval);
    timerContainer.classList.remove('warning');
}

function handleTimeout() {
    questionResults.push(false);
    updateProgressMap();
    
    // Fall animation (Orijinal koddan alındı)
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

// Progress map functions (Orijinal koddan alındı)
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

// Shuffle array (Orijinal koddan alındı)
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Start Game (Orijinal koddan alındı)
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

// Load Question (GÜNCELLENMİŞ: Video/Resim kontrolü eklendi)
// Load Question (GÜNCELLENMİŞ: Video/Resim kontrolü, TimeLimit ve temizlik eklendi)
function loadQuestion() {
    resetState();
    
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGame();
        return;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // YENİ: Sorunun zaman limitini al, yoksa 30 saniye varsayılan kullan
    // Eğer bir soruda timeLimit belirtmediyseniz 30 saniye kullanılır.
    const questionTimeLimit = currentQuestion.timeLimit || 30; 
    
    // İlerleme çubuğunu güncelle
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // 1. Temizlik ve Sıfırlama (Önceki medyayı gizle)
    signImage.classList.add('hide'); 
    signVideo.classList.add('hide');
    signIframe.classList.add('hide'); 
    signVideo.src = ''; 
    signIframe.src = ''; 

    // 2. Medya Tipine Göre Gösterme
    if (currentQuestion.mediaType === 'youtube') {
        signIframe.src = currentQuestion.videoSource;
        signIframe.classList.remove('hide');

    } else if (currentQuestion.mediaType === 'video') {
        signVideo.src = currentQuestion.videoSource;
        signVideo.load();
        // Oynatma denemesi, autoplay engellerine karşı yakalama
        signVideo.play().catch(e => console.log("Video autoplay failed:", e)); 
        signVideo.classList.remove('hide');

    } else { // Varsayılan olarak resim gösterilir (veya 'image' medya tipi)
        signImage.src = currentQuestion.image;
        signImage.alt = currentQuestion.correctAnswer;
        signImage.classList.remove('hide');
    }

    // Soruyu ve şıkları yükle
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // 3. Şıkları yükle
    currentQuestion.choices.forEach(function(choice) {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', selectAnswer);
        choicesList.appendChild(li);
    });
    
    updateProgressMap();
    
    // GÜNCELLENDİ: Yeni zaman limitini startTimer'a gönder
    startTimer(questionTimeLimit); 
}

// Reset State (GÜNCELLENMİŞ: Video oynatmayı durdurma eklendi)
function resetState() {
    stopTimer();
    feedbackDiv.textContent = '';
    nextBtn.classList.add('hide');
    
    // Video varsa durdur
    if (signVideo && !signVideo.paused) {
        signVideo.pause();
        signVideo.currentTime = 0; // Başa sar
    }

    while (choicesList.firstChild) {
        choicesList.removeChild(choicesList.firstChild);
    }
}

// Select Answer (Orijinal koddan alındı)
function selectAnswer(e) {
    stopTimer();
    
    // Video varsa durdur
    if (signVideo && !signVideo.paused) {
        signVideo.pause();
    }
    
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

// End Game (Orijinal koddan alındı)
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

// Event Listeners (Orijinal koddan alındı)
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

const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

initTheme();
createTrafficEmojis();