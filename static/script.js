let time = 30; 
let timer;
let timerStarted = false;
let correctAnswer;
let totalQuestions = 0;
let CorrectCount = 0;

// --- PAGE INITIALIZATION ---
window.addEventListener("load", function () {
    let playerName = localStorage.getItem("playerName");
    if (!playerName && document.getElementById("welcomePopup")) {
        document.getElementById("welcomePopup").style.display = "flex";
    }
    
    let userDisplay = document.getElementById("practiceUser");
    if (userDisplay && playerName) userDisplay.innerHTML = "👋 " + playerName;
});

// --- HOME PAGE FUNCTIONS ---
function selectType(type, element) {
    localStorage.setItem("type", type);
    document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
    element.classList.add("selected");
}

function setLevel(lvl, element) {
    localStorage.setItem("level", lvl);
    document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
    element.classList.add("active");
}

function startPractice() {
    if (!localStorage.getItem("type")) {
        alert("Please select a Practice Area!");
        return;
    }
    window.location.href = "/practice";
}
function saveUser() {
    let nameInput = document.getElementById("playerInput");
    let name = nameInput.value.trim().toLowerCase(); 
    let nameRegex = /^[a-z\s]{3,20}$/;
    let vowels = name.match(/[aeiou]/g);
    let vowelCount = vowels ? vowels.length : 0;
    let consonants = name.match(/[bcdfghjklmnpqrstvwxyz]/g);
    let consonantCount = consonants ? consonants.length : 0;
    let tripleConsonants = /[^aeiou\s]{3,}/.test(name);
    let repeating = /(.)\1\1/.test(name);
    let junkWords = ["abc", "xyz", "pqr", "qwerty", "asdf", "abcsa", "lmn"];
    let isJunk = junkWords.some(word => name.includes(word));

    if (!nameRegex.test(name) || isJunk || vowelCount < 1 || consonantCount < 2 || tripleConsonants || repeating) {
        Swal.fire({
            icon: 'error',
            title: 'Ye Kaisa Naam Hai? 🤔',
            text: 'Kripya apna asli naam bhariye (Jaise: Ankit, Payal, Sumit). Random letters allowed nahi hain!',
            confirmButtonColor: '#d33'
        });
        return; 
    }

    localStorage.setItem("playerName", nameInput.value.trim()); 
    document.getElementById("welcomePopup").style.display = "none";
    
    let userDisplay = document.getElementById("practiceUser");
    if (userDisplay) userDisplay.innerHTML = "👋 " + nameInput.value.trim();
}

// --- PRACTICE PAGE FUNCTIONS ---
function setTimer(seconds, element) {
    if (timerStarted) return;
    time = seconds;
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
    element.classList.add("active");
    startCountdown();
}

function startCountdown() {
    let count = 3;
    let cdFilm = document.getElementById("countdownFilm");
    if(document.getElementById("timeSelection")) {
        document.getElementById("timeSelection").style.display = "none";
    }
    cdFilm.style.display = "flex";

    let interval = setInterval(() => {
        cdFilm.innerHTML = count;
        count--;
        if (count < 0) {
            clearInterval(interval);
            cdFilm.style.display = "none";
            startGame();
        }
    }, 1000);
}

function startGame() {
    timerStarted = true;
    totalQuestions = 0;
    CorrectCount = 0;
    document.getElementById("questionArea").style.display = "block";
    generateQuestion();
    startTimerTick();
}

function generateQuestion() {
    const type = localStorage.getItem("type");
    const lvl = localStorage.getItem("level") || "easy";
    let a, b, c, qText;

    if (lvl === "easy") { a = Math.floor(Math.random() * 9) + 1; b = Math.floor(Math.random() * 9) + 1; }
    else if (lvl === "medium") { a = Math.floor(Math.random() * 90) + 10; b = Math.floor(Math.random() * 90) + 10; }
    else { a = Math.floor(Math.random() * 900) + 100; b = Math.floor(Math.random() * 900) + 100; c = 50; }

    if (type === "addition") { 
        qText = (lvl === "hard") ? `${a} + ${b} + ${c}` : `${a} + ${b}`;
        correctAnswer = (lvl === "hard") ? a + b + c : a + b;
    } else if (type === "subtraction") {
        if (a < b) [a, b] = [b, a];
        qText = `${a} - ${b}`; correctAnswer = a - b;
    } else if (type === "multiplication") {
        qText = `${a} × ${b}`; correctAnswer = a * b;
    } else if (type === "division") {
        a = a * b; qText = `${a} ÷ ${b}`; correctAnswer = a / b;
    } else if (type === "mixed") {
    let operations = ["+", "-", "x", "÷"];
    let op = operations[Math.floor(Math.random() * operations.length)];

    if (op === "+") {
        qText = a + " + " + b;
        correctAnswer = a + b;
    } 
    else if (op === "-") {
        if (a < b) [a, b] = [b, a]; 
        qText = a + " - " + b;
        correctAnswer = a - b;
    } 
    else if (op === "x") {
        qText = a + " x " + b;
        correctAnswer = a * b;
    } 
    else if (op === "÷") { 
        a = a * b; 
        qText = a + " ÷ " + b;
        correctAnswer = a / b;
    }
}

    document.getElementById("question").innerHTML = qText;
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();
}

function checkAnswer() {
    let val = document.getElementById("answer").value;
    if (val === "" || !timerStarted) return;

    totalQuestions++;
    if (parseInt(val) === correctAnswer) {
        CorrectCount++;
        document.getElementById("result").innerHTML = "<span style='color:green'>✅ Correct!</span>";
    } else {
        document.getElementById("result").innerHTML = "<span style='color:red'>❌ Wrong! Ans: " + correctAnswer + "</span>";
    }

    setTimeout(() => {
        document.getElementById("result").innerHTML = "";
        if (timerStarted) generateQuestion();
    }, 800);
}

// --- UPDATED TIMER TICK WITH SWEET ALERT ---
function startTimerTick() {
    clearInterval(timer);
    let display = document.getElementById("time");
    
    timer = setInterval(() => {
        time--;
        if (display) display.innerHTML = time;
        
        if (time <= 0) {
            clearInterval(timer);
            timerStarted = false;

            // SweetAlert Popup
            Swal.fire({
                title: 'Time Up! ⏱️',
                text: 'Great effort! Let\'s see how you performed.',
                icon: 'info',
                confirmButtonText: 'Check Result',
                confirmButtonColor: '#1e5aa8',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    showResults(); 
                }
            });
        }
    }, 1000);
}

function showResults() {
    let acc = totalQuestions > 0 ? Math.round((CorrectCount / totalQuestions) * 100) : 0;
    document.getElementById("totalQ").innerText = totalQuestions;
    document.getElementById("correctQ").innerText = CorrectCount;
    document.getElementById("wrongQ").innerText = totalQuestions - CorrectCount;
    document.getElementById("accuracyQ").innerText = acc;
    document.getElementById("resultScreen").style.display = "flex";

    // Backend Save
    fetch("/save_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: localStorage.getItem("playerName") || "Guest",
            total: totalQuestions, 
            correct: CorrectCount, 
            accuracy: acc
        })
    }).then(res => console.log("Score Saved!"));
}
function changeName() {
    Swal.fire({
        title: 'Naya Naam Likhein ✍️',
        input: 'text',
        inputLabel: 'Apna sahi naam enter karein',
        inputPlaceholder: 'Naya naam yahan likhein...',
        showCancelButton: true,
        confirmButtonText: 'Update Karein',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#1e5aa8',
        
        inputValidator: (value) => {
            if (!value) {
                return 'Naam khali nahi ho sakta!';
            }
            
            let name = value.trim();
            let nameRegex = /^[a-zA-Z\s]{3,}$/;
            let vowels = name.match(/[aeiouAEIOU]/g);
            let vowelCount = vowels ? vowels.length : 0;
            let isRepeating = /(.)\1\1/.test(name.toLowerCase());

            if (!nameRegex.test(name) || vowelCount < 1 || isRepeating) {
                return 'Kripya ek sahi naam bhariye!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let newName = result.value.trim();
        
            localStorage.setItem("playerName", newName);
            
            let userDisplay = document.getElementById("practiceUser");
            if (userDisplay) {
                userDisplay.innerHTML = "👋 " + newName;
            }
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: 'Naam badal gaya hai!'
            });
        }
    });
}
// Navigation & Keys
function playAgain() { location.reload(); }
function goHome() { window.location.href = "/"; }
function exitPractice() { window.location.href = "/"; }

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
});