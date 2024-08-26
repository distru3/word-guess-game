//setting title
let title = "Guess The Word";
document.title = title;
document.querySelector("h1").innerText = title;

//setting game options
let tries = 7;
let Letters = 6;
let currentTry = 1;
let numOfHints = 2;
let flag = true;

//setting buttons
const hintButton = document.querySelector(".hint")
const answerButton = document.querySelector(".check");

//managing words

let turnWord = '';
let words = [
    'Always',	'Column',	'Became',	'Degree',
    'Amount',	'Combat',	'Become',	'Demand',
    'Animal',	'Coming',	'Before',	'Depend',
    'Annual',	'Common',	'Behalf',	'Deputy',
    'Answer',	'Comply',	'Behind',	'Desert',
    'Anyone',	'Copper',	'Belief',	'Design',
    'Anyway',	'Corner',	'Belong',	'Desire',
    'Appeal',	'Costly',	'Beaker',	'Detail',
    'Appear',	'County',	'Better',	'Detect',
    'Beyond',	'Budget',	'During',	'Device',
    'Bishop',	'Burden',	'Easily',	'Differ',
    'Border',	'Bureau',	'Eating',	'Dinner',
    'Bottle',	'Button',	'Editor',	'Direct',
    'Bottom',	'Camera',	'Effect',	'Doctor',
    'Bought',	'Cancer',	'Effort',	'Dollar',
    'Branch',	'Cactus',	'Eighth',	'Domain',
    'Breath',	'Carbon',	'Either',	'Double',
    'Bridge',	'Career',	'Eleven',	'Driven',
    'Bright',	'Castle',	'Emerge',	'Driver'];
turnWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

console.log(turnWord)

//managing hints 
document.querySelector(`.hint span`).innerText = numOfHints;

function generateInput(){
    const attempts = document.querySelector(".inputs");


    //creating every attempt
    for(let i = 1; i <= tries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Attempt ${i}</span>`
        attempts.appendChild(tryDiv);

        //adding an inactive class for other attempts
        if (i !== 1) tryDiv.classList.add("inactive");


        //creating each input
        for(let j = 1; j <= Letters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength","1");
            tryDiv.appendChild(input);
        };
        attempts.appendChild(tryDiv);
    };

    //focus on the first input in the first attempt
    attempts.children[0].children[1].focus()

    //disable all attempts except the first one
    const inactiveAttempts = document.querySelectorAll(".inactive input");
    inactiveAttempts.forEach(input => (input.disabled = true))

    const inputs = document.querySelectorAll("input")
    inputs.forEach((input, index)=>{
        //operations to be done on each input
        input.addEventListener("input",function() {
            //transform the input entered to uppercase 
            this.value = this.value.toUpperCase();
            //go to the next input in line if exists
            const nextInput = inputs[index + 1];
            if(nextInput)nextInput.focus();
        })
        input.addEventListener("keydown", function(event){
            const currentIndex = Array.from(inputs).indexOf(this);
            if(event.key == "ArrowRight"){
                const nextIndex = currentIndex + 1;
                if(nextIndex < inputs.length) inputs[nextIndex].focus();
            }
            if(event.key == "ArrowLeft"){
                const prevIndex = currentIndex - 1;
                if(prevIndex >= 0) inputs[prevIndex].focus();
            }
        })
    })
};

//managing awnser button function
function guess(){
    let successfulGuess = true;
    for(let i =1; i <= Letters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const correctLetter = turnWord[i-1];

        // game logic

        if(letter == correctLetter){
            // letter in place
            inputField.classList.add("in-place");
        }else if(turnWord.includes(letter) && letter !== ""){
            // letter not in place 
            inputField.classList.add("not-in-place");
            successfulGuess = false;
        }else{
            // letter incorrect
            inputField.classList.add("incorrect");
            successfulGuess = false;
        }
    }

    //checking the status of the guess
    let massage = document.querySelector('.massege');
    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let tryAgainButton = document.createElement("button");
    tryAgainButton.innerText = "Try again?"
    let cancelButton = document.createElement("button");
    cancelButton.innerText="X";
    cancelButton.classList.add("cancel");
    if(successfulGuess){
        // disabling all inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("inactive"));
        // disabling the buttons
        answerButton.disabled = true;
        hintButton.disabled = true;
        h2.innerText="YOU WON!"
        span.innerText=`${turnWord}`
        currentTry == 1?       p.innerText=`You took ${currentTry} attempt

        The word was: 
        `:       p.innerText=`You took ${currentTry} attempts

        The word was: 
        `;
        p.append(span);
        massage.append(h2);
        massage.append(p);
        massage.append(tryAgainButton);
        tryAgainButton.addEventListener("click",reloading);
        massage.append(cancelButton);
        cancelButton.addEventListener("click",()=>massage.style.display = "none");
        document.querySelector(".massege").style.display = "block"
        flag = false;
    }else{
        //disabling failed attempt
        document.querySelector(`.try-${currentTry}`).classList.add("inactive");
        const failedAttemptInputs = document.querySelectorAll(`.try-${currentTry} input`);
        failedAttemptInputs.forEach((input) => input.disabled = true);
        currentTry++;

        //enabling next attempt
        const currentAttemptInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentAttemptInputs.forEach((input) => input.disabled = false);
        let el =  document.querySelector(`.try-${currentTry}`);
        if(el){
            el.classList.remove("inactive");
            el.children[1].focus();
        }else{
            answerButton.disabled = true;
            hintButton.disabled = true;
            h2.innerText="YOU LOSE!"
            span.innerText=`${turnWord}`
            p.innerText=`The word was: 
            `
            p.append(span);
            massage.append(h2);
            massage.append(p);
            massage.append(tryAgainButton);
            tryAgainButton.addEventListener("click",reloading)
            massage.append(cancelButton);
            cancelButton.addEventListener("click",()=>massage.style.display = "none");
            document.querySelector(".massege").style.display = "block"
            flag = false;
        }
    }
}
answerButton.addEventListener("click", guess);
//managing hint button
hintButton.addEventListener("click", getHint);
function getHint(){
    if(numOfHints > 0){
        numOfHints--;
        document.querySelector('.hint span').innerText = numOfHints
    } if(numOfHints == 0){
        hintButton.disabled = true;
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if(emptyInputs.length > 0){
        const randomInd = Math.floor(Math.random() * emptyInputs.length);
        const randominput = emptyInputs[randomInd];
        const indexToFill = Array.from(enabledInputs).indexOf(randominput);
        randominput.value = turnWord[indexToFill].toUpperCase();
    }
}

//managing try again button 
function reloading() {
    location.reload();
}

//managing use of backspace

function backspace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            if(currentInput.value){
                currentInput.value="";
            }else{
                prevInput.value="";
                prevInput.focus();
            }
        }
    }
}
document.addEventListener("keydown",backspace);

//managing enter
function enter(event){
    if(event.key === "Enter" && flag){
        guess()
    }
}
document.addEventListener("keydown",enter)


window.onload = ()=>generateInput();