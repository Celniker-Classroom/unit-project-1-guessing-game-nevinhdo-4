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

    const feedback = document.getElementById("feedback");
    const result = document.getElementById("result");

    if (feedback) {
        feedback.textContent = message;
    }
    if (result) {
        result.textContent = message;
    }
}

function setGuessButtonsDisabled(disabled) {
    document.getElementById("guessBtn").disabled = disabled;

    const submitButton = document.getElementById("submit");
    if (submitButton) {
        submitButton.disabled = disabled;
    }
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
    roundsPlayed++;
    totalRoundTime += elapsedTime;
    fastestTime = fastestTime === 0 ? elapsedTime : Math.min(fastestTime, elapsedTime);

    document.getElementById("fastest").textContent = "Fastest Game: " + fastestTime;
    document.getElementById("avgTime").textContent = "Average Time: " + Math.round(totalRoundTime / roundsPlayed);
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

renderLeaderboard();