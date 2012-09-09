

$(function () {
  breakOut = new Breakout();
  
});

var Breakout = function () {
  this.gameLoop = null;
  this.init();
  this.draw();
};

Breakout.prototype.captureKeys = function () {
  var that = this;
  $(document).keyup(function(evt) {
      if (evt.keyCode == 13) {
        if (breakOut.gameLoop === null) {
          breakOut.clear();
          breakOut.init();
          breakOut.start();
        }
      }
  });

  $(document).keydown(function(evt) {
    if (evt.keyCode === 39) {
        that.paddleMove = 'RIGHT';
    } else if (evt.keyCode === 37){
        that.paddleMove = 'LEFT';
    }
    that.movePaddle(that.paddleMove);
  });         

  $(document).keyup(function(evt) {
      if (evt.keyCode == 39) {
          that.paddleMove = 'RIGHTNONE';
      } else if (evt.keyCode == 37){
          that.paddleMove = 'LEFTNONE';
      }
  }); 
};

Breakout.prototype.init = function () {
  var that = this;

  this.canvas = $("#canvas")[0];
  this.ctx = canvas.getContext('2d');
  this.backgroundColor = "black";

  Score.init(this.ctx);
  
  this.ball = new Ball(50, 450, 12, 360);
  this.paddle =  new  Paddle(40, 500,  80, 20,"orange");
  
  this.bricks = [
        [1,1,1,1,1,1,1,2],
        [1,1,3,1,0,1,1,1],
        [2,1,3,1,2,1,0,1],
        [3,2,2,2,0,2,1,1]
      ];

  this.bricksxx = [
        [0,0,1,0,0,0,0,0]
      ];

  this.brickObjects = [];
  this.ballObjects = [];

  this.game = this;
  this.gameOver = false;

  this.width = canvas.width;
  this.height = canvas.height;
  
  this.clear();

  this.bouncingSound = new Audio("sound/bounce.ogg");
  this.breakingSound = new Audio("sound/break.ogg");
  
  this.captureKeys();

  var bricksPerRow = 8;               
  var brickHeight = 20;
  var brickWidth = this.canvas.width/bricksPerRow;


  for (var r=0; r < that.bricks.length; r++) {
    for (var c=0; c < that.bricks[r].length; c++) {
      var brick = new Brick(c * brickWidth,r * brickHeight, brickWidth, brickHeight, "brown");
      
      switch(this.bricks[r][c]) {
         case 0:
            brick.isActive = false;
            brick.color = "black";
            brick.value = 0;
            break;
         case 1:
            brick.color = "green";
            brick.value = 1;
            break;
         case 2:
            brick.color = "yellow";
            brick.value = 2;
            break;
         case 3:
            brick.color = "orange";
            brick.value = 3;
            break;
      }

      that.brickObjects.push(brick);
    }
  }
};

Breakout.prototype.randomRange = function(min, max) {
    return Math.floor(Math.random() * (max + 1 -min)) + min;
};

Breakout.prototype.start = function () {
  var that = this;
  that.clear();

  Score.reset();
  this.gameOver = false;

  
  this.ball.x = this.randomRange(10,590);
  this.ball.y = this.randomRange(80,400);

  this.ballObjects.push(this.ball);   

  if (that.gameLoop === null) {
    that.gameLoop = setInterval((function(self) {
      return function () {
        self.moveBall(self);
      }
    })(that), 1000/60);
  }
};

Breakout.prototype.endGame = function (that) {
   clearInterval(that.gameLoop);
   that.gameLoop = null;
   that.gameOver = true;

   $(document).off();
   that.captureKeys();
   return;
};


Breakout.prototype.draw = function () {
  this.ball.draw(this.ctx);
  this.paddle.draw(this.ctx);
  Score.update();

  var bricks = this.brickObjects;
  for (var i = 0; i < bricks.length; i++) {
    if (!bricks[i].isActive) {
        bricks[i].color = this.backgroundColor;
    }
    bricks[i].draw(this.ctx);
    
  }
};

Breakout.prototype.clear = function () {
   this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
};

Breakout.prototype.checkWinner = function () {
  var result = true;
  var bricks = this.brickObjects;
  for (var i = 0; i < bricks.length; i++) {
    if (bricks[i].isActive) {
        result = false;
        break;
    }
  }
  return result;
};

Breakout.prototype.winMessage = function () {
  this.ctx.save();

  this.ctx.shadowColor = 'red';
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.shadowBlur = 5;

  this.ctx.font = "20pt Calibri";
  this.ctx.strokeStyle = "rgba(255,255,255,0.4)"; // 40% opaque white
  this.ctx.fillStyle = "#fff";
  this.ctx.fillText('Congratulations! You win.', this.canvas.width/2-40, this.canvas.height/4);
  this.ctx.fillText('PRESS <ENTER> or <RETURN> key to start the game.', 30, this.canvas.height/2);
  this.ctx.restore();
}

Breakout.prototype.moveBall = function(self) {
  if (self.gameOver) {
    this.endGame(self);
    return;
  }
  
  this.draw(); 

  for(var i = 0; i < this.ballObjects.length; i++) {
    //this.ball.move();
    this.ballObjects[i].move();
  }
  
  this.checkBallToWallCollision();
  this.checkBallToPaddleCollision();
  this.checkBallToBricksCollision();

  if (this.game.checkWinner()) {
    this.gameOver = true;
    this.clear();

    this.winMessage();
    
    Score.update();
  }


  /*
  if (self.paddleMove === 'RIGHTNONE') {
    self.movePaddle('RIGHT',2);
  }
  else {
    self.movePaddle('LEFT',-2);
  }
  */

};

Breakout.prototype.incrementScore = function (value) {
  switch(value) {
    case 0:
      break;
    case 1:
     Score.increment(10);
      break;
    case 2:
      Score.increment(12);
      break;
    case 3:
      Score.increment(15);
      var ball = new Ball(this.randomRange(10,590), this.randomRange(80,400), 12, 360);
      ball.color = Color.getRandomColor();
      ball.ctx = this.ctx;
      this.ballObjects.push(ball);
      break;
  }
};

Breakout.prototype.checkBallToBricksCollision = function() {
  var bricks = this.brickObjects;

  for (var i = 0; i < bricks.length; i++) {
    for (var ballIndex = 0; ballIndex < this.ballObjects.length; ballIndex++) {
      if (this.ballObjects[ballIndex].getYBounds() <= bricks[i].y + bricks[i].height){
       if (this.ballObjects[ballIndex].getXBounds() >= bricks[i].x && 
            this.ballObjects[ballIndex].getXBounds() <= bricks[i].x + bricks[i].width) {
            
            if (bricks[i].isActive) {
              this.breakingSound.play();
              this.ballObjects[ballIndex].deltaY = -this.ballObjects[ballIndex].deltaY;
              bricks[i].isActive = false;
              
              this.ballObjects[ballIndex].backgroundColor = bricks[i].color; // todo

              this.incrementScore(bricks[i].value);
            }
        }
      }
    }
  }  
};

Breakout.prototype.checkBallToPaddleCollision = function () {
  for(var index = 0; index < this.ballObjects.length; index++) {
    // if bottom of ball reaches the top of paddle,
    if (this.ballObjects[index].y + this.ballObjects[index].deltaY + this.ballObjects[index].radius >= this.paddle.y){
      // and it is positioned between the two ends of the paddle (is on top)
      if (this.ballObjects[index].x + this.ballObjects[index].deltaX >= this.paddle.x && 
        this.ballObjects[index].x + this.ballObjects[index].deltaX <= this.paddle.x + this.paddle.width){
          this.bouncingSound.play();
          this.ballObjects[index].deltaY = - this.ballObjects[index].deltaY;
      }
    }
  }
}

Breakout.prototype.lostMessage = function () {
   this.ctx.save();

   this.ctx.shadowColor = 'red';
   this.ctx.shadowOffsetX = 1;
   this.ctx.shadowOffsetY = 1;
   this.ctx.shadowBlur = 5;

   //this.ctx.font = "20pt Calibri";
   this.ctx.font = "12pt Slackey";
   this.ctx.strokeStyle = "rgba(255,255,255,0.4)"; // 40% opaque white

   this.ctx.fillStyle = "#ddd";

   this.ctx.fillText('The End!!!! Better luck next time.', 30, this.canvas.height/4);
   this.ctx.fillText('PRESS <ENTER> or <RETURN> key to start the game.', 30, this.canvas.height/2);

   this.ctx.restore();
}

Breakout.prototype.checkBallToWallCollision = function () {
    for(var index = 0; index < this.ballObjects.length; index++) {  
      // check left collision
      if (this.ballObjects[index].x <= 5) {
          this.ballObjects[index].deltaX = Math.abs(this.ballObjects[index].deltaX);
      }

      // Check top collision
      if (this.ballObjects[index].y <= 5) {
          this.ballObjects[index].deltaY = Math.abs(this.ballObjects[index].deltaY);
      }

      // Check right wall collision from left
      if (this.ballObjects[index].deltaY > 0 && this.ballObjects[index].x >= 595) {
          this.ballObjects[index].deltaX = -1 * this.ballObjects[index].deltaY;
      }

      // Check right wall collision from bottom
      if (this.ballObjects[index].deltaY < 0 && this.ballObjects[index].x >= 595) {
          this.ballObjects[index].deltaX = -1 * this.ballObjects[index].deltaX;
      }
        
      if (this.ballObjects[index].y >= 550) {
         this.clear();

         this.lostMessage();
        
         this.gameOver = true;
         this.endGame(this);
         Score.update();
      }
    }
};

Breakout.prototype.movePaddle = function(dir, delta) {
   if (this.paddle.x < 10) {
      this.paddle.deltaX = 0;
   }
  
   if (this.paddle.x > 500) {
      this.paddle.deltaX = 0;
   }

   if (this.paddle.x < 10 && dir === 'RIGHT') {
      this.paddle.deltaX = delta || 5;
   }

   if (this.paddle.x > 500 && dir === 'LEFT') {
      this.paddle.deltaX = delta || -5;
   }
   
   this.paddle.move(dir);
   this.checkBallToPaddleCollision();
};