//Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = 0;
let currentRange = 3;

const playerName = prompt("Please enter your name below");

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
            document.getElementById("msg").textContent = "Hot! You're very close! Try lower";
        } else if (num - answer < warmValue) {
            document.getElementById("msg").textContent = "Warm! Too high, try again.";
        } else {
            document.getElementById("msg").textContent = "Cold! Too high, try again.";
        }
    } else {
        if (answer - num < hotValue) {
            document.getElementById("msg").textContent = "Hot! You're very close! Try higher";
        } else if (answer - num < warmValue) {
            document.getElementById("msg").textContent = "Warm! Too low, try again.";
        } else {
            document.getElementById("msg").textContent = "Cold! Too low, try again.";
        }
    }
}

//guessing
document.getElementById("guessBtn").addEventListener("click", function(){
    let input = parseInt(document.getElementById("guess").value);
    let num = parseInt(input);

    if (isNaN(num)){
        document.getElementById("msg").textContent = "Please enter a valid number.";
        return; 
    }


    guessCount++;

    //correct
    if (num === answer){
        document.getElementById("msg").textContent = "Correct! " + playerName + " got it in " + guessCount + " guesses!";
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