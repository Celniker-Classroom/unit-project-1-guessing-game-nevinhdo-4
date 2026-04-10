// Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = [];
let currentRange = 3;
let roundStartTime = null;
let fastestTime = 0;
let totalRoundTime = 0;
let roundsPlayed = 0;
let playerName = "Player";
let hasPromptedForName = false;
let rainbowTimeoutId = null;
let stopwatchIntervalId = null;
let audioContext = null;

function formatPlayerName(name) {
    const trimmedName = (name || "").trim();
    return trimmedName
        ? trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase()
        : "Player";
}

function initializeName() {
    if (hasPromptedForName) {
        return;
    }

    hasPromptedForName = true;

    if (typeof prompt === "function") {
        try {
            playerName = formatPlayerName(prompt("Please enter your name below") || "Player");
        } catch {
            playerName = "Player";
        }
    }
}

function setMessage(message) {
    document.getElementById("msg").textContent = message;
}

function setGuessButtonsDisabled(disabled) {
    document.getElementById("guessBtn").disabled = disabled;

    const submitButton = document.getElementById("submit");
    if (submitButton) {
        submitButton.disabled = disabled;
    }
}

function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }

    if (audioContext === null) {
        audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume().catch(function() {
            return null;
        });
    }

    return audioContext;
}

function playClickSound() {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const startTime = ctx.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(700, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(480, startTime + 0.07);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.025, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.08);
}

function playWinHornSound() {
    const ctx = getAudioContext();
    if (!ctx) {
        return;
    }

    const notes = [392, 523.25, 659.25];

    for (let i = 0; i < notes.length; i++) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const startTime = ctx.currentTime + (i * 0.12);
        const endTime = startTime + 0.28;

        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(notes[i], startTime);
        oscillator.frequency.exponentialRampToValueAtTime(notes[i] * 1.08, endTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.05, startTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(startTime);
        oscillator.stop(endTime);
    }
}

function celebrateWinTitle() {
    const title = document.getElementById("gameTitle");
    if (!title) {
        return;
    }

    title.classList.add("rainbow-win");

    if (rainbowTimeoutId !== null) {
        clearTimeout(rainbowTimeoutId);
    }

    rainbowTimeoutId = setTimeout(function() {
        title.classList.remove("rainbow-win");
        rainbowTimeoutId = null;
    }, 3000);
}

function setLevelButtonsDisabled(disabled) {
    const radios = document.getElementsByName("level");
    for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
    }
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    if (day % 10 === 1) {
        return "st";
    }
    if (day % 10 === 2) {
        return "nd";
    }
    if (day % 10 === 3) {
        return "rd";
    }
    return "th";
}

function time() {
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return monthName + " " + day + getDaySuffix(day) + ", " + year + " " + hours + ":" + minutes + ":" + seconds;
}

function updateClock() {
    document.getElementById("date").textContent = time();
}

updateClock();
setInterval(updateClock, 1000);

function formatDuration(ms) {
    return (ms / 1000).toFixed(1) + "s";
}

function setStopwatchTone(elapsedTime) {
    const currentTime = document.getElementById("currentTime");
    if (!currentTime) {
        return;
    }

    currentTime.classList.remove("timer-neutral", "timer-fast", "timer-average", "timer-slow");

    if (roundsPlayed === 0 || fastestTime === 0) {
        currentTime.classList.add("timer-neutral");
        return;
    }

    const averageTime = totalRoundTime / roundsPlayed;

    if (elapsedTime <= fastestTime) {
        currentTime.classList.add("timer-fast");
    } else if (elapsedTime <= averageTime) {
        currentTime.classList.add("timer-average");
    } else {
        currentTime.classList.add("timer-slow");
    }
}

function updateLiveStopwatch() {
    const currentTime = document.getElementById("currentTime");
    if (!currentTime) {
        return;
    }

    if (roundStartTime === null) {
        currentTime.textContent = "Current Time: 0.0s";
        setStopwatchTone(0);
        return;
    }

    const elapsedTime = new Date().getTime() - roundStartTime;
    currentTime.textContent = "Current Time: " + formatDuration(elapsedTime);
    setStopwatchTone(elapsedTime);
}

function startStopwatch() {
    if (stopwatchIntervalId !== null) {
        clearInterval(stopwatchIntervalId);
    }

    updateLiveStopwatch();
    stopwatchIntervalId = setInterval(updateLiveStopwatch, 100);
}

function stopStopwatch() {
    if (stopwatchIntervalId !== null) {
        clearInterval(stopwatchIntervalId);
        stopwatchIntervalId = null;
    }
}

function renderLeaderboard() {
    const leaderboardItems = document.getElementsByName("leaderboard");
    for (let i = 0; i < leaderboardItems.length; i++) {
        leaderboardItems[i].textContent = scores[i] !== undefined ? String(scores[i]) : "--";
    }
}

function updateScore(score) {
    totalWins++;
    totalGuesses += score;
    scores.push(score);
    scores.sort(function(a, b) {
        return a - b;
    });

    document.getElementById("wins").textContent = "Total wins: " + totalWins;
    document.getElementById("avgScore").textContent = "Average Score: " + (totalGuesses / totalWins);
    renderLeaderboard();
}

function updateTimers(endMs) {
    if (roundStartTime === null) {
        return;
    }

    const elapsedTime = endMs - roundStartTime;
    stopStopwatch();
    roundsPlayed++;
    totalRoundTime += elapsedTime;
    fastestTime = fastestTime === 0 ? elapsedTime : Math.min(fastestTime, elapsedTime);

    document.getElementById("currentTime").textContent = "Current Time: " + formatDuration(elapsedTime);
    setStopwatchTone(elapsedTime);
    document.getElementById("fastest").textContent = "Fastest Game: " + formatDuration(fastestTime);
    document.getElementById("avgTime").textContent = "Average Time: " + formatDuration(Math.round(totalRoundTime / roundsPlayed));
    roundStartTime = null;
}

function reset() {
    setGuessButtonsDisabled(true);
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
    setLevelButtonsDisabled(false);
}

function play() {
    initializeName();

    const radios = document.getElementsByName("level");
    let range = 3;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            range = parseInt(radios[i].value);
        }
    }

    currentRange = range;
    guessCount = 0;
    roundStartTime = new Date().getTime();
    startStopwatch();
    answer = Math.floor(Math.random() * range) + 1;

    setMessage(playerName + ", pick a number 1-" + range + "!");
    document.getElementById("guess").value = "";
    setGuessButtonsDisabled(false);
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
    setLevelButtonsDisabled(true);
}

function giveFeedback(num, correctAnswer, hotValue, warmValue) {
    if (num > correctAnswer) {
        if (num - correctAnswer < hotValue) {
            setMessage(playerName + ", hot! Too high, try lower.");
        } else if (num - correctAnswer < warmValue) {
            setMessage(playerName + ", warm! Too high, try lower.");
        } else {
            setMessage(playerName + ", cold! Too high, try lower.");
        }
    } else {
        if (correctAnswer - num < hotValue) {
            setMessage(playerName + ", hot! Too low, try higher.");
        } else if (correctAnswer - num < warmValue) {
            setMessage(playerName + ", warm! Too low, try higher.");
        } else {
            setMessage(playerName + ", cold! Too low, try higher.");
        }
    }
}

function makeGuess() {
    const num = parseInt(document.getElementById("guess").value);

    if (isNaN(num)) {
        setMessage(playerName + ", please enter a valid number.");
        return;
    }

    guessCount++;

    if (num === answer) {
        updateScore(guessCount);
        updateTimers(new Date().getTime());
        setMessage("Correct! " + playerName + " got it in " + guessCount + " guesses!");
        playWinHornSound();
        celebrateWinTitle();
        reset();
        return;
    }

    if (currentRange === 3) {
        giveFeedback(num, answer, 1, 2);
    } else if (currentRange === 10) {
        giveFeedback(num, answer, 2, 3);
    } else {
        giveFeedback(num, answer, 6, 17);
    }
}

function giveUp() {
    guessCount = currentRange;
    updateScore(guessCount);
    updateTimers(new Date().getTime());
    setMessage(playerName + ", you gave up! The answer was " + answer + ".");
    reset();
}

document.querySelectorAll("button").forEach(function(button) {
    button.addEventListener("pointerdown", playClickSound);
});

document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);
document.getElementById("darkModeBtn").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

const submitButton = document.getElementById("submit");
if (submitButton) {
    submitButton.addEventListener("click", function() {
        document.getElementById("guessBtn").click();
    });
}

initializeName();
setMessage(playerName + ", select a level to start!");
renderLeaderboard();