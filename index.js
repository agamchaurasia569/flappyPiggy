let board;
let boardWidth = 380;
let boardHeight = 680;
let context;

let piggyWidth = 50;
let piggyHeight = 38;
let piggyX = boardWidth / 18;
let piggyY = boardHeight / 2;
let piggyImag;
let piggy = {
    x: piggyX,
    y: piggyY,
    width: piggyWidth,
    height: piggyHeight
};

//pipe
let pipeArray = [];
let pipeWidth = 50;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//velocity
let velocityX = -2;
let velocityY =0;
let gravity = 0.4;
let gameOver =false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //01.use to draw on canvas

    //drawing piggy    
    //load IMAGE
    piggyImag = new Image();
    piggyImag.src = "./powerpiggy.png";
    piggyImag.onload = function() {
        context.drawImage(piggyImag, piggy.x, piggy.y, piggyWidth, piggyHeight);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", movePiggy);
    document.addEventListener("click", movePiggy);
    document.addEventListener("click",playSound);
    document.addEventListener("keydown",playSound);
    
};

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    context.clearRect(0, 0, board.width, board.height);

    //piggy
    velocityY +=gravity;
    piggy.y = Math.max(piggy.y + velocityY,0) ;
    context.drawImage(piggyImag, piggy.x, piggy.y, piggy.width, piggy.height);
    if(piggy.y > board.height){
        gameOver=true;
        var audioDie = new Audio("./audio/sfx_die.wav")
        audioDie.play()
    }
    //pipe
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if(!pipe.passed && piggy.x > pipe.x + pipe.width){
            score+=0.5;
            pipe.passed = true;
            var audioPoint = new Audio("./audio/sfx_point.wav") //play point sound
            audioPoint.play()
           
           
        }
        if(detectCollision(piggy,pipe)){
            
            gameOver=true;
            var audioHit =new Audio("./audio/sfx_hit.wav")
            audioHit.play()
            
        }
    }
    //clear PIPE
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); // Remove first element from array by using shift method.
    }

    
    //score
    context.fillstyle ="white";
    context.font="60px sans-serif";
    context.fillText(score,10,50);
    if(gameOver){
        context.fillText("GAME OVER",10, 340);
        
    }
    
}

function placePipes() {
    if(gameOver){
        return;
    }


    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace, 
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}
function movePiggy(e){
    if(e.code=="Space" || e.code == "ArrowUp" || e.code =="KeyX" || e.type ==="click"){
        velocityY = -6;
        //reset
        if(gameOver){
            piggy.y=piggyY;
            pipeArray=[];
            score=0;
            gameOver= false;

        }
    }
}

function detectCollision(a,b){
    return a.x<b.x+ b.width &&
            a.x + a.width>b.x &&
            a.y < b.y+b.height &&
            a.y+a.height>b.y;
            
}
function playSound(){
    
        var audio = new Audio("./audio/sfx_flap.wav")
        audio.play()
            
          
    }
    
    
    
     
