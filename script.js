//Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = [];
let currentRange = 3;

const rawPlayerName = prompt("Please enter your name below") || "Player";
const trimmedPlayerName = rawPlayerName.trim();
const playerName = trimmedPlayerName
    ? trimmedPlayerName.charAt(0).toUpperCase() + trimmedPlayerName.slice(1).toLowerCase()
    : "Player";

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

    //round setup
    //pick answer
    answer = Math.floor(Math.random() * range) + 1;
    //disable and engange buttons and radio choices
    document.getElementById("msg").textContent = playerName + ", pick a number 1-" + range + "!";
    document.getElementById("guess").value = "";
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
})


//feedback function
function giveFeedback(num, answer, hotValue, warmValue) {
    if (num > answer) {
        if (num - answer < hotValue) {
            document.getElementById("msg").textContent = playerName + ", hot! You're very close! Try lower.";
        } else if (num - answer < warmValue) {
            document.getElementById("msg").textContent = playerName + ", warm! Too high, try again.";
        } else {
            document.getElementById("msg").textContent = playerName + ", cold! Too high, try again.";
        }
    } else {
        if (answer - num < hotValue) {
            document.getElementById("msg").textContent = playerName + ", hot! You're very close! Try higher.";
        } else if (answer - num < warmValue) {
            document.getElementById("msg").textContent = playerName + ", warm! Too low, try again.";
        } else {
            document.getElementById("msg").textContent = playerName + ", cold! Too low, try again.";
        }
    }
}

//guessing
document.getElementById("guessBtn").addEventListener("click", function(){
    let input = parseInt(document.getElementById("guess").value);
    let num = parseInt(input);

    if (isNaN(num)){
        document.getElementById("msg").textContent = playerName + ", please enter a valid number.";
        return; 
    }


    guessCount++;

    //correct
    if (num === answer){
        totalWins++;
        totalGuesses += guessCount;
        const averageScore = totalGuesses / totalWins;

        updateLeaderboard();
        document.getElementById("wins").textContent = "Total wins: " + totalWins;
        document.getElementById("avgScore").textContent = "Average Score: " + averageScore;
        document.getElementById("msg").textContent = "Correct! " + playerName + " got it in " + guessCount + " guesses!";
        document.getElementById("guessBtn").disabled = true;
        document.getElementById("giveUpBtn").disabled = true;
        document.getElementById("playBtn").disabled = false;
    }

    //incorrecct
    if (num !== answer) {
        if (currentRange === 3) {
            giveFeedback(num, answer, 1, 2);
        } else if (currentRange === 10) {
            giveFeedback(num, answer, 2, 3);
        } else {
            giveFeedback(num, answer, 6, 17);
        }
    }
})