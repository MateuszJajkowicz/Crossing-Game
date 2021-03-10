var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;
let width = 40;
var isGameOver = false;
//var score = 0;
//localStorage.setItem("highScore", score);

class GameCharacter{
    constructor(x, y, width, height, color, xSpeed, ySpeed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.maxSpeed = 4;
    }

    moveVertically(character){
        if(character == "enemies"){
            if (this.y > screenHeight - 40 || this.y <  0) {
                this.ySpeed = -this.ySpeed;        
            }
            this.y += this.ySpeed;
        }
        if(character == "player"){
            if (this.y > screenHeight - 40) {
                this.y = screenHeight - 40;       
            }
            else if (this.y <  0) {
                this.y = 0;       
            }
            this.y += this.ySpeed;
        }
    }

    moveHorizontally() {
            this.x += this.xSpeed;
            if (this.x < 0) {
                this.x = 0;
            }
            else if (this.x > screenWidth - 40){
                this.x = screenWidth - 40;
            }
    }
}

var enemies = [
    new GameCharacter(200, 225, width, width, "rgb(0, 0, 255)", 0, parseInt(localStorage.getItem("highScore"), 10)  + 2),
    new GameCharacter(450, screenHeight -50, width, width, "rgb(0, 0, 255)", 0, parseInt(localStorage.getItem("highScore"), 10)  + 3),
    new GameCharacter(700, 0, width, width, "rgb(0, 0, 255)", 0, parseInt(localStorage.getItem("highScore"), 10)  + 4),
];

var player = new GameCharacter(50, 225, width, width, "rgb(0, 255, 0)", 0, 0);

var goal = new GameCharacter(screenWidth - 50, 225, width, width, "rgb(0, 0, 0)", 0, 0)

var sprites = {};

var loadSprites = function(){
    sprites.player = new Image();
    sprites.player.src = "images/hero.png";

    sprites.background = new Image();
    sprites.background.src = "images/floor.png";

    sprites.enemy = new Image();
    sprites.enemy.src = "images/enemy.png";

    sprites.goal = new Image();
    sprites.goal.src = "images/chest.png";
}

document.onkeydown = function(event) {
    switch(event.key) {
        case 'ArrowRight':
            player.xSpeed = player.maxSpeed;
            break;
        case 'ArrowLeft':
            player.xSpeed = -player.maxSpeed;
            break;
        case 'ArrowUp':
            player.ySpeed = -player.maxSpeed;
            break;
        case 'ArrowDown':
            player.ySpeed = player.maxSpeed;
            break;
    }
};

document.onkeyup = function(event) {
    var keyUp = event.key;
    if (keyUp == "ArrowRight" || keyUp == "ArrowLeft"){
        player.xSpeed = 0;
    }
    if (keyUp == "ArrowUp" || keyUp == "ArrowDown"){
        player.ySpeed = 0;
    }

};

var checkCollisions = function(rect1, rect2) {
    let rect1x2 = rect1.x + rect1.width;
    let rect2x2 = rect2.x + rect2.width;
    let rect1y2 = rect1.y + rect1.height;
    let rect2y2 = rect2.y + rect2.height;
    
    return rect1.x < rect2x2 && rect1x2 > rect2.x && rect1.y < rect2y2 && rect1y2 > rect2.y; 
}


var draw = function(){
    ctx.clearRect(0, 0, screenWidth, screenWidth)

    ctx.drawImage(sprites.background, 0, 0)

    ctx.drawImage(sprites.player, player.x, player.y)

    enemies.forEach(function(element){
        ctx.drawImage(sprites.enemy, element.x, element.y)
    });

    ctx.drawImage(sprites.goal, goal.x, goal.y)

    // ctx.fillStyle = player.color;
    // ctx.fillRect(player.x, player.y, player.width, player.height);

    // enemies.forEach(function(element){
    //     ctx.fillStyle = element.color;
    //     ctx.fillRect(element.x, element.y, element.width, element.height);
    // });

    // ctx.fillStyle = goal.color;
    // ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

var update = function(){
    enemies.forEach(function(element){
        if(checkCollisions(player, element)){
            endGameLogic("Game over!");
            localStorage.setItem("highScore", 0);
        };
        element.moveVertically("enemies");
    })

    if(checkCollisions(player, goal)){
        endGameLogic("You win!");
        localStorage.setItem("highScore", parseInt(localStorage.getItem("highScore"), 10)  + 1);
        score += 1;
        console.log('1')
        console.log(localStorage.getItem("highScore"))
    };

    player.moveHorizontally();
    player.moveVertically("player");

}

var endGameLogic = function(text){
    isGameOver = true;
    alert(text);
    window.location = "";
}

var step = function (){
    update();
    draw();
    
    if(!isGameOver){
        window.requestAnimationFrame(step);
    }    
}

loadSprites();
step();

var pScore = document.getElementById("pScore")
pScore.innerHTML = localStorage.getItem("highScore")
console.log(localStorage);