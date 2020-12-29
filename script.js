/* DOM ELEMENTS */

let container = document.querySelector(".container");
let loadButton = document.querySelector(".load");
let uploadButton = document.querySelector(".uploadButton");
let input = document.querySelector(".input");
let enemyContainer = document.querySelector(".enemies");
let scoreContainer = document.querySelector(".scoreContainer");
let player = document.querySelector(".character");
let character = document.querySelector(".character");
let header = document.querySelector(".header");
let endScreenContainer = document.querySelector(".endScreen");
let music = document.querySelector(".music");
let slider = document.querySelector(".slider");
let musicIcon = document.querySelector(".sound-symbol");
let startButton = document.querySelector(".startButton");
let inputs = document.querySelector(".inputs");
let checkbox = document.querySelector(".checkboxes");
let restartbutton = document.querySelector(".restart-button");

/* VARIABLES */

let goRight = false;
let goLeft = false;
let goUp = false;
let goDown = false;
let atBotLimit = false;
let atLeftLimit = false;
let atRightLimit = false;
let atTopLimit = false;
let Lost = false;
let pause = false;
let spawnRight = false;
let increasedOnce = false;
let increasedtwice = false;
let increasedthrice = false;
let increasedFourth = false;
let increasedFifth = false;
let startedMusic = false;
let muted = false;

let spawnSpeed = 1000;
let volume = 0.5;
let score = 0;
let collisionSofter = 13;
let redDestroyPosition = 447.5;
let blueDestroyPosition = 1;
let greenDestroyPosition = 639;
let darkDestroyPosition = 70;
let currentData = "";
let toPrint = "";
let recentclick = false;

let playerPosition;
let heart;
let spawnEnemies;
let Update;
let lastVolume;

music.volume = volume;



/* EVENTLISTENERS */

document.addEventListener('keydown', function(event){

    if (String.fromCharCode(event.keyCode) === "&" ||
    String.fromCharCode(event.keyCode) === "W"){
    goUp = true;
    if (!goRight && !goLeft)
    character.classList.add("characterAnimRight");
    }

    else if (String.fromCharCode(event.keyCode) === "(" ||
     String.fromCharCode(event.keyCode) === "S"){
    goDown = true;
    if (!goRight && !goLeft)
    character.classList.add("characterAnimRight");
    }

    else if (String.fromCharCode(event.keyCode) === "'" ||
     String.fromCharCode(event.keyCode) === "D"){
    goRight = true;
    character.classList.add("characterAnimRight");
    }

    else if ((String.fromCharCode(event.keyCode) === "%" ||
    String.fromCharCode(event.keyCode) === "A")){
    goLeft = true;
    character.classList.add("characterAnimLeft");
    }

    else if (String.fromCharCode(event.keyCode) === "R")
    if (input !== document.activeElement)
        restartGame();
})

document.addEventListener('keyup', function(){
    if (String.fromCharCode(event.keyCode) === "&" ||
    String.fromCharCode(event.keyCode) === "W"){
    goUp = false;
    if (!goRight && !goDown)
    character.classList.remove("characterAnimRight");
    }

    else if (String.fromCharCode(event.keyCode) === "(" ||
    String.fromCharCode(event.keyCode) === "S"){
    goDown = false;
    if (!goRight && !goUp)
    character.classList.remove("characterAnimRight");
    }

    if (String.fromCharCode(event.keyCode) === "'" ||
     String.fromCharCode(event.keyCode) === "D"){
    goRight = false;
    if (!goDown && !goUp)
    character.classList.remove("characterAnimRight");
    }

    else if ((String.fromCharCode(event.keyCode) === "%" ||
    String.fromCharCode(event.keyCode) === "A")){
    goLeft = false;
    character.classList.remove("characterAnimLeft");
    }
})

slider.addEventListener("change", function(){
    volume = slider.value / 100;
    music.volume = volume;
    // slider !== document.activeElement;
})

musicIcon.addEventListener("click", function(){
    if (muted) {
        music.volume = lastVolume;
        slider.value = lastVolume * 100;
        muted = false;
    } else {
        lastVolume = music.volume;
        music.volume = 0;
        slider.value = 0;
        muted = true;
    }
});

restartbutton.addEventListener("click", function(){
   restartGame();
});


/* FUNCTIONS */

// spawn enemies ev

const spawnEnemiesTop = function(){
    let spawnPosition = Math.floor((Math.random() * (95 - 0 + 1)));
    let addEnemy = `<div class="enemy" style="left:${spawnPosition}%"; ></div>`
    enemyContainer.insertAdjacentHTML("beforeend", addEnemy);
}

const spawnEnemiesRight = function(){
    let spawnPosition = Math.floor((Math.random() * (95 - 15 + 1))) + 15;
    let addEnemy = `<div class="enemyRight" style="top:${spawnPosition}%"; ></div>`
    enemyContainer.insertAdjacentHTML("beforeend", addEnemy);
}

const spawnEnemiesLeft = function(){
    let spawnPosition = Math.floor((Math.random() * (95 - 15 + 1))) + 15;
    let addEnemy = `<div class="enemyLeft" style="top:${spawnPosition}%"; ></div>`
    enemyContainer.insertAdjacentHTML("beforeend", addEnemy);
}

const spawnEnemiesBottom = function(){
    let spawnPosition = Math.floor((Math.random() * (95 - 0 + 1)));
    let addEnemy = `<div class="enemyBottom" style="left:${spawnPosition}%"; ></div>`
    enemyContainer.insertAdjacentHTML("beforeend", addEnemy);
}

const spawnAllEnemies = function(){
    spawnEnemiesTop();
    spawnEnemiesRight();
    spawnEnemiesLeft();
    spawnEnemiesBottom();
}

const collisionCheck = function(enemies, destroyPosition, color){
    for (let enemy of enemies){ //checking player collision with enemies
        if (((enemy.offsetTop + enemy.offsetHeight) > (player.offsetTop + collisionSofter) && // Top side of player
        enemy.offsetTop < (player.offsetTop + (player.offsetHeight - (collisionSofter *0.8)))) &&  // Lower side of player 
        ((enemy.offsetLeft + enemy.offsetWidth) > (player.offsetLeft + collisionSofter) && // Left side of player
        (enemy.offsetLeft) < (player.offsetLeft + (player.offsetWidth - collisionSofter)))){ // Right side of player
            
            enemyContainer.removeChild(enemy);
            removeHeart();
        }
        if ((color === "red" && enemy.offsetTop > (destroyPosition)) || 
            (color === "blue" && enemy.offsetLeft < (destroyPosition)) ||
            (color === "green" && enemy.offsetLeft > (destroyPosition)) ||
            (color === "dark" && enemy.offsetTop < (destroyPosition))){ // Enemy has passed the field without hitting player  
            if (enemyContainer.contains(enemy)){
                enemyContainer.removeChild(enemy);
                increaseScore();
            }
        }
    }
}

const increaseScore = function(){
    score++;
    scoreContainer.innerHTML = "<p>Score: " + score + "</p>";
}

const removeHeart = function(){
    hearts = document.querySelectorAll(".heart");
    heart = hearts[hearts.length -1];
    header.removeChild(heart);
}

const playerLimitCheck = function(){
    // Making so the player cant walk outside the gameview
    if (player.offsetTop === 70) // Top limit 
    atTopLimit = true;
    else (atTopLimit = false);
    
    if (player.offsetTop === (442)) // Bot limit
    atBotLimit = true;
    else (atBotLimit = false);
    
    if (player.offsetLeft === 1) // Left limit
    atLeftLimit = true;
    else (atLeftLimit = false);
    
    if (player.offsetLeft === 657) // Right limit
    atRightLimit = true;
    else (atRightLimit = false);
}

const playerMovement = function(){
    
    if (goRight && !atRightLimit){
        character.style.left = (player.offsetLeft + 1 + "px");
    } 
    
    if (goLeft && !atLeftLimit){
        character.style.left = (player.offsetLeft - 1 + "px");
    }
    
    if (goUp && !atTopLimit){
        character.style.top = (player.offsetTop - 1 + "px");
    } 
    
    if (goDown && !atBotLimit){
        character.style.top = (player.offsetTop + 1 + "px");
    } 
}

const lifeCheck = function(){
    
    hearts = document.querySelectorAll(".heart");
    if (hearts.length == 0)
    Lost = true;
    
}

const resetStuff = function(){
    spawnSpeed = 1000;
    Lost = false;
    score = 0;
    scoreContainer.innerHTML = "<p>Score: " + score + "</p>";
    enemyContainer.innerHTML = "";
    increasedFifth = false;
    increasedFourth = false;
    increasedthrice = false;
    increasedtwice = false;
    increasedOnce = false;
}

const loadMusic = function() {
    music.load();
}

const endGame = function(){
    
    clearInterval(spawnEnemies);
    clearInterval(Update);

    endScreenContainer.classList.remove("dontShow");
}

const restartGame = function(){
    endScreenContainer.classList.add("dontShow");
    inputs.classList.remove("dontShow");
    checkbox.classList.add("dontShow");
    clearInterval(spawnEnemies);
    clearInterval(Update);
    
    hearts = document.querySelectorAll(".heart");
    for (let heart of hearts){
        header.removeChild(heart);
    }

    resetHearts = '<img src="heart.svg" alt="heart" class="heart"><img src="heart.svg" alt="heart" class="heart"><img src="heart.svg" alt="heart" class="heart">'
    header.insertAdjacentHTML("beforeend", resetHearts);
    
    resetStuff();
    spawnEnemies = setInterval(runGameSpawnEnemies, spawnSpeed);
    Update = setInterval(runGameUpdate, 1);
    music.load();
}

const runGameUpdate = function(){
    let enemiesTop = document.querySelectorAll(".enemy");
    collisionCheck(enemiesTop, redDestroyPosition, "red");
    
    let enemiesRight = document.querySelectorAll(".enemyRight");
    collisionCheck(enemiesRight, blueDestroyPosition, "blue");

    let enemiesLeft = document.querySelectorAll(".enemyLeft");
    collisionCheck(enemiesLeft, greenDestroyPosition, "green");

    let enemiesBottom = document.querySelectorAll(".enemyBottom");
    collisionCheck(enemiesBottom, darkDestroyPosition, "dark");
    
    
    playerLimitCheck();
    playerMovement();
    lifeCheck();

    /* Increase difficulty at specific scores */

    if (score > 90 && increasedOnce === false){
        clearInterval(spawnEnemies);
        spawnSpeed = 800;
        increasedOnce = true;
        spawnEnemies = setInterval(spawnAllEnemies, spawnSpeed);
    }

    if (score > 160 && increasedtwice === false){
        clearInterval(spawnEnemies);
        spawnSpeed = 600;
        increasedtwice = true;
        spawnEnemies = setInterval(spawnAllEnemies, spawnSpeed);
    }

    if (score > 270 && increasedthrice === false){
        clearInterval(spawnEnemies);
        spawnSpeed = 500;
        increasedthrice = true;
        spawnEnemies = setInterval(spawnAllEnemies, spawnSpeed);
    }

    if (score > 450 && increasedFourth === false){
        clearInterval(spawnEnemies);
        spawnSpeed = 400;
        increasedFourth = true;
        spawnEnemies = setInterval(spawnAllEnemies, spawnSpeed);
    }

    if (score > 600 && increasedFifth === false){
        clearInterval(spawnEnemies);
        spawnSpeed = 300;
        increasedFifth = true;
        spawnEnemies = setInterval(spawnAllEnemies, spawnSpeed);
    }

    if (Lost)
        endGame();
}

const runGameSpawnEnemies = function(){
    spawnEnemiesTop();

    if (score > 5)
        spawnEnemiesRight();
    
    if (score > 25)
        spawnEnemiesLeft();
    
    if (score > 50)
        spawnEnemiesBottom();
}

    /* RUNNING THE GAME */

startButton.addEventListener("click", function(){
    music.load();
    spawnEnemies = setInterval(function(){
        runGameSpawnEnemies();
    }, spawnSpeed);
    
    Update = setInterval(function(){
        runGameUpdate();
    }, 1)

    startButton.classList.add("dontShow");
})

toArray = (firebaseObject) => {
    let array = []
    for (let item in firebaseObject) {
        array.push({ ...firebaseObject[item], key: item })
    }
    return array;
}

firebase.database().ref(`/scores`).on('value', (snapshot) => {
    let scores = this.toArray(snapshot.val());
    console.log(scores);
    data = [...scores];
    print(data);
})

let print = function(data){
    console.log(data);
    toPrint = "";

    data.sort(function(a, b){
        return b.score - a.score
    });
    console.log(data);
    for (let i = 0; i < 20; i++){
        toPrint += 
        `
        <div class="data-card">
            <div class="rank">  ${i + 1}        </div>
            <div class="name">  ${data[i].name}  </div>
            <div class="score"> ${data[i].score} </div>
        </div>
        `
        }
    container.innerHTML = toPrint;
}

uploadButton.addEventListener("click", async function(){
    if (input.value.length > 15){
        alert("Name too long! (Max 15 characters)")
    } else if (input.value.length == 0) {
        alert("Please enter a name before uploading.")
    } else if (!recentclick) {
        recentclick = true;
        let myData = {
            "name": input.value,
            "score": score
        }
        firebase.database().ref('/scores').push(myData)
          .then(result => {
            inputs.classList.add("dontShow");
            checkbox.classList.remove("dontShow");
            recentclick = false;
          })
          .catch(error => {
            recentclick = false;
            alert("Upload failed. Please try again later");
          })
    }
});


