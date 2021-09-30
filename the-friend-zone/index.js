const screen = { height: 500, width: 800 };
const enemies = ['matt', 'edith', 'paige', 'yoshi'];
const spriteSize = 100;
let score = 0;
let total = 0;

function addScore(points){
    score += points;
    document.getElementById('score').innerHTML = `${score} / ${total}`;
}

function sendSprite(img, lvl, yOffset){
    const sprite = document.createElement('img');
    sprite.src = img;
    sprite.classList.add('sprite');
    sprite.classList.add(`lvl-${lvl}`);
    sprite.style = `margin-top: ${yOffset}px`;
    sprite.addEventListener('click', (e) => {
        const target = e.target;
        target.style.animationPlayState = 'paused';
        target.style.transform = window.getComputedStyle(e.target).transform;
        target.style.marginTop = window.getComputedStyle(e.target).marginTop;
        target.classList.remove('lvl-1');
        target.style.animationPlayState = 'unset';
        target.classList.add('dead');
        addScore(lvl);
        setTimeout(() => { target.remove() }, 2000);
    })
    document.getElementById('game-window').appendChild(sprite);
    setTimeout(() => {
        sprite.remove();
    }, parseInt(`${window.getComputedStyle(sprite).animationDuration}`.replace('s', '000')));
}

let enemies_lvl1 = setInterval(() => {
    sendSprite(
        /* img */ `./imgs/enemies/stinky${enemies[Math.floor(Math.random()*enemies.length)]}.png`,
        /* lvl */ 1,
        /* y-position */ Math.random() * (screen.height - spriteSize)
    );
    total += 1;
    addScore(0);
}, 1000);

setTimeout(() => {
    clearInterval(enemies_lvl1);
}, 60000);