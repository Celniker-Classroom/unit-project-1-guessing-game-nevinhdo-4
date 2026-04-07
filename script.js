//Setting variables
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = 0;

//Play
//get level
document.getElementById("playBtn").addEventListener("click", function(){
    let radios = document.getElementsByName("level");
    let range = 3;
    for (let i=0; i < radios.length; i++{
        if(radios[i].checked){
            range = parseInt(radios[i].value)
        }
    })
})

//round setup
//pick answer

answer = Math.floor(Math.random() * range) + 1;
//disable and engange buttons and radio choices
document.getElementById("msg").textContent = playerName + ", guess a number between 1 and 10"
document.getElementById("guess").value = "";
document.getElementById("guessBtn").disabled = false;
document.getElementById("giveUpBtn").disabled = false;
document.getElementById("playBtn").disables = true;

let levelRadios = document.getElementById("level");
for (let i=0; i < radios.length; i++) {
    if (radios[i].checked){
        range = parseInt(radios[i].value);  
    }
}