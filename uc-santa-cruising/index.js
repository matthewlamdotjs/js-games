/* Game Params */
const screen = { height: 500, width: 800 };
const nextPositions = ['-first-position', '-second-position', '-third-position', '-fourth-position', '-final-position'];
const transitionTime = 800;
const totalHealth = 100;
const frequency = transitionTime * 3;
let currentHealth = 100;
let isAirborne = false;
let playerIsLeft = true;
/* Audio */
const yoshiOw = new Audio('audio/yoshiow.mp3');
const skateSound = new Audio('audio/skate.mp3');
skateSound.loop = true;
const ollieSound = new Audio('audio/ollie.mp3');
const landingSound = new Audio('audio/landing.mp3');

function startGame(){
    // remove intro screen
    document.getElementById('overlay').style.display = 'none';
    
    const yoshi = document.getElementById('yoshi');
    skateSound.play();

    function moveLeft(){
        yoshi.classList.remove('yoshi-right');
        yoshi.classList.add('yoshi-left');
        playerIsLeft = true;
    }

    function moveRight(){
        yoshi.classList.remove('yoshi-left');
        yoshi.classList.add('yoshi-right');
        playerIsLeft = false;
    }

    function jump(){
        if(!isAirborne){
            isAirborne = true;
            ollieSound.play();
            skateSound.pause();
            yoshi.src = 'imgs/yoshi2.png';
            yoshi.classList.add('yoshi-jump');
            setTimeout(() => {
                yoshi.src = playerIsLeft ? 'imgs/yoshi3.png' : 'imgs/yoshi1.png';
            }, 200);
            setTimeout(() => {
                yoshi.classList.remove('yoshi-jump')
            }, 900);
            setTimeout(() => {
                yoshi.src = 'imgs/yoshi1.png';
                isAirborne = false;
            }, 1200);
            setTimeout(() => {
                landingSound.play();
                skateSound.play();
            }, 1300);
        }
    }

    // key controls
    document.addEventListener('keydown', (e) => {
        if(!isAirborne){
            switch(e.code){
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'Space':
                    jump();
                    break;
            }
        }
    });

    // main game loop
    let gamePlay = setInterval(() => {
        const isDouble = Math.floor(Math.random()*2);
        if(isDouble){
            sendWalker('fast', true);
            sendWalker('fast', false);
            return;
        }
        sendWalker('fast', Math.floor(Math.random()*2));
    }, frequency);

    // helper function to send pedestrians down the road
    function sendWalker(type, left){
        if(currentHealth > 0){
            let counter = 0;
            // init walker
            let walker = document.createElement('img');
            walker.src = `imgs/${type}walker.gif`;
            walker.className = `${type} walker ${left ? 'left' : 'right'}${nextPositions[counter]}`;
            counter++;
            // render on screen
            document.getElementById('game-window').appendChild(walker);
            // helper for moving positions
            function movePosition(sprite){
                sprite.classList.remove(`${left ? 'left' : 'right'}${nextPositions[counter - 1]}`);
                sprite.classList.add(`${left ? 'left' : 'right'}${nextPositions[counter]}`);
                counter++;
            }
            let walkerInterval = setInterval(() => {
                if(counter < nextPositions.length){
                    if(counter == 3 && !isAirborne && playerIsLeft == left){
                        takeDamage();
                    }
                    movePosition(walker);
                }
                else{
                    clearInterval(walkerInterval);
                    walker.remove();
                }
            }, transitionTime);
        }
    }

    // helper function to take damage when hitting a pedestrian
    function takeDamage(){
        if(currentHealth == 0) return;
        yoshi.classList.add('damage-taken');
        yoshiOw.play();
        setTimeout(() => { yoshi.classList.remove('damage-taken'); }, 400);
        currentHealth -= 10;
        checkGameOver();
        document.getElementById('score').innerHTML = `${currentHealth} / ${totalHealth}`;
    }
    
    function checkGameOver(walkerInterval){
        if(currentHealth <= 0){
            endGame(walkerInterval);
        }
    }
    
    function endGame(walkerInterval){
        clearInterval(walkerInterval);
        clearInterval(gamePlay);
        alert('GAME OVER!');
    }
}
