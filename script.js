//Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = [];
let currentRange = 3;
let roundStartTime = null;
let fastestTime = null;
let totalRoundTime = 0;
let roundsPlayed = 0;

const rawPlayerName = prompt("Please enter your name below") || "Player";
const trimmedPlayerName = rawPlayerName.trim();
const playerName = trimmedPlayerName
    ? trimmedPlayerName.charAt(0).toUpperCase() + trimmedPlayerName.slice(1).toLowerCase()
    : "Player";

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

function updateDateTime() {
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

    document.getElementById("date").textContent =
        monthName + " " + day + getDaySuffix(day) + ", " + year + " " + hours + ":" + minutes + ":" + seconds;
}

updateDateTime();
setInterval(updateDateTime, 1000);

function updateLeaderboard() {
    scores.push(guessCount);
    scores.sort(function(a, b) {
        return a - b;
    });

    let leaderboardItems = document.getElementsByName("leaderboard");
    for (let i = 0; i < leaderboardItems.length; i++) {
        leaderboardItems[i].textContent = scores[i] !== undefined ? scores[i] : "";
    }
}

function updateTimeStats() {
    if (roundStartTime === null) {
        return;
    }

    const elapsedTime = new Date().getTime() - roundStartTime;
    roundsPlayed++;
    totalRoundTime += elapsedTime;
    fastestTime = fastestTime === null ? elapsedTime : Math.min(fastestTime, elapsedTime);

    document.getElementById("fastest").textContent = "Fastest Game: " + fastestTime;
    document.getElementById("avgTime").textContent = "Average Time: " + Math.round(totalRoundTime / roundsPlayed);
    roundStartTime = null;
}

function endRound() {
    setGuessButtonsDisabled(true);
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
}

//Play
//get level
document.getElementById("playBtn").addEventListener("click", function(){
    let radios = document.getElementsByName("level");
    let range = 3;
    for (let i=0; i < radios.length; i++) {
        if(radios[i].checked){
            range = parseInt(radios[i].value)
        }
    }
    currentRange = range;
    guessCount = 0;
    roundStartTime = new Date().getTime();

    //round setup
    //pick answer
    answer = Math.floor(Math.random() * range) + 1;
    //disable and engange buttons and radio choices
    setMessage(playerName + ", pick a number 1-" + range + "!");
    document.getElementById("guess").value = "";
    setGuessButtonsDisabled(false);
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
})


//feedback function
function giveFeedback(num, answer) {
    const difference = Math.abs(num - answer);
    const direction = num > answer ? "lower" : "higher";

    if (difference <= 2) {
        setMessage(playerName + ", hot! You're very close! Try " + direction + ".");
    } else if (difference <= 5) {
        setMessage(playerName + ", warm! Try " + direction + ".");
    } else {
        setMessage(playerName + ", cold! Try " + direction + ".");
    }
}

//guessing
document.getElementById("guessBtn").addEventListener("click", function(){
    let input = parseInt(document.getElementById("guess").value);
    let num = parseInt(input);

    if (isNaN(num)){
        setMessage(playerName + ", please enter a valid number.");
        return; 
    }


    guessCount++;

    //correct
    if (num === answer){
        totalWins++;
        totalGuesses += guessCount;
        const averageScore = totalGuesses / totalWins;

        updateLeaderboard();
        updateTimeStats();
        document.getElementById("wins").textContent = "Total wins: " + totalWins;
        document.getElementById("avgScore").textContent = "Average Score: " + averageScore;
        setMessage("Correct! " + playerName + " got it in " + guessCount + " guesses!");
        endRound();
    }

    //incorrecct
    if (num !== answer) {
        giveFeedback(num, answer);
    }
})

document.getElementById("giveUpBtn").addEventListener("click", function() {
    updateTimeStats();
    setMessage(playerName + ", you gave up! The answer was " + answer + ".");
    endRound();
})

const submitButton = document.getElementById("submit");
if (submitButton) {
    submitButton.addEventListener("click", function() {
        document.getElementById("guessBtn").click();
    });
}