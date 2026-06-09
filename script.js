// Sample Questions Bank
const questionBank = {
    Railway: [
        { q: "ভারতের প্রথম বুলেট ট্রেন কোন দুটি শহরের মধ্যে চলবে?", options: ["মুম্বাই - আহমেদাবাদ", "দিল্লি - মুম্বাই", "কলকাতা - দিল্লি", "চেন্নাই - বেঙ্গালুরু"], answer: 0 },
        { q: "রেল ইঞ্জিন কে আবিষ্কার করেন?", options: ["জেমস ওয়াট", "জর্জ স্টিফেনসন", "টমাস আলভা এডিসন", "রাইট ব্রাদার্স"], answer: 1 }
    ],
    SSC: [
        { q: "ভারতের সংবিধানের কত নম্বর ধারাকে 'সংবিধানের আত্মা' বলা হয়?", options: ["ধারা ২১", "ধারা ৩২", "ধারা ৪৪", "ধারা ৪৫"], answer: 1 },
        { q: "পানিপথের প্রথম যুদ্ধ কত সালে হয়েছিল?", options: ["১৫২৬", "১৫৫৬", "১৭৬১", "১dfb"], answer: 0 }
    ],
    Banking: [
        { q: "ভারতের কেন্দ্রীয় ব্যাংকের নাম কী?", options: ["State Bank of India", "Reserve Bank of India", "HDFC Bank", "Punjab National Bank"], answer: 1 }
    ]
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 600; // 10 Minutes in seconds

function startExam(category) {
    currentQuestions = questionBank[category];
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 600; 
    
    document.getElementById("exam-title").innerText = category + " মক টেস্ট";
    document.getElementById("home-page").classList.add("hidden");
    document.getElementById("exam-page").classList.remove("hidden");
    
    initPalette();
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById("q-num").innerText = `প্রশ্ন ${currentQuestionIndex + 1}:`;
    document.getElementById("q-text").innerText = q.q;
    
    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = "";
    
    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option-item";
        if (userAnswers[currentQuestionIndex] === index) {
            div.classList.add("selected");
        }
        div.innerText = option;
        div.onclick = () => selectOption(index);
        optionsBox.appendChild(div);
    });

    updatePaletteStyles();
}

function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    loadQuestion();
    updatePaletteStyles();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function initPalette() {
    const paletteBox = document.getElementById("palette-box");
    paletteBox.innerHTML = "";
    currentQuestions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.className = "palette-btn";
        btn.id = `palette-b-${index}`;
        btn.innerText = index + 1;
        btn.onclick = () => {
            currentQuestionIndex = index;
            loadQuestion();
        };
        paletteBox.appendChild(btn);
    });
}

function updatePaletteStyles() {
    currentQuestions.forEach((_, index) => {
        const btn = document.getElementById(`palette-b-${index}`);
        btn.classList.remove("active", "answered");
        
        if (index === currentQuestionIndex) {
            btn.classList.add("active");
        }
        if (userAnswers[index] !== undefined) {
            btn.classList.add("answered");
        }
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        } else {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById("timer").innerText = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function submitExam() {
    clearInterval(timerInterval);
    let score = 0;
    currentQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            score++;
        }
    });
    
    document.getElementById("exam-page").classList.add("hidden");
    document.getElementById("result-page").classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
    document.getElementById("total-score").innerText = currentQuestions.length;
}

function goToHome() {
    document.getElementById("result-page").classList.add("hidden");
    document.getElementById("home-page").classList.remove("hidden");
}
