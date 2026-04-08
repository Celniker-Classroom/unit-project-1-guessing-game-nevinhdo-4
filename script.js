//Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = 0;

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

    //round setup
    //pick answer
    answer = Math.floor(Math.random() * range) + 1;
    //disable and engange buttons and radio choices
    document.getElementById("msg").textContent = playerName + ", guess a number between 1 and" + range + "!";
    document.getElementById("guess").value = "";
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;

    for (let i=0; i < radios.length; i++) {
        if (radios[i].checked){
            range = parseInt(radios[i].value);  
        }
    }
})
//guessing
document.getElementById("guessBtn").addEventListener("click", function(){
    let input = parseInt(document.getElementById("guess").value);
    let num = parseInt(input);

    if (isNaN(num)){
        document.getElementById("msg").textContent = "Please enter a valid number.";
        return; 
    }


    guessCount++;
    let diff = Math.abs(num - answer);  

    //correct
    if (num === answer){
        document.getElementById("msg").textContent = "Correct! " + playerName + " got it in " + guessCount + " guesses!";
    }

    //incorrecct
    if (num > answer){
        if (num - answer < 2){
            document.getElementById("msg").textContent = "Hot! You're very close! Try lower";
        } else if (num - answer < 3){
            document.getElementById("msg").textContent = "Warm! Too high, try again.";
        } else {
            document.getElementById("msg").textContent = "Cold! Too high, try again.";
        }
    } else {
        if (num < answer)
         if (answer - num < 2){
            document.getElementById("msg").textContent = "Hot! You're very close! Try higher";
        } else if (answer - num < 3){
            document.getElementById("msg").textContent = "Warm! Too low, try again.";
        } else {
            document.getElementById("msg").textContent = "Cold! Too low, try again.";
        }
    }

})