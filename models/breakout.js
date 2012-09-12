

$(function () {
  breakOut = new Breakout();
  
});

var Breakout = function () {
  if (!(this instanceof Breakout)) {
      return new Breakout();
  }
  this.gameLoop = null;
  this.isPaused = false;
  this.init();
  this.draw();
};


Breakout.prototype.pause = function (self) {
  clearInterval(self.gameLoop);   
}

Breakout.prototype.resume = function (that) {
  clearInterval(that.gameLoop);
  that.gameLoop = setInterval((function(self) {
    return function () {
      self.animate(self);
    }
  })(that), 1000/60);
}

Breakout.prototype.captureKeys = function () {
  var that = this;
  $(document).on("keyup",function(evt) {
      if (evt.keyCode === 13) {
        if (that.gameLoop === null) {
          that.clear();
          that.init();
          that.start();
        }
      }
      // if 'p' key pressed, then pause
      else if (evt.keyCode === 80) {
        if (!that.isPaused) {
            that.isPaused = true;
            that.pause(that); 
          }
      }
      else if (evt.keyCode === 82) {   // 'r' key pressed
          if (that.isPaused) {
            that.isPaused = false;
            that.resume(that);        
          }
      }
      
  });

  $(document).on("keydown keypress keyup",function(evt) {
    if (evt.keyCode === 39) {
        that.paddleMove = 'RIGHT';
    } else if (evt.keyCode === 37){
        that.paddleMove = 'LEFT';
    }
    that.movePaddle(that.paddleMove, that.paddle.deltaX);
  });         

  
  $(document).on("keyup",function(evt) {
      if (that.paddleMove === 'LEFT') {
        that.paddle.deltaX = -2;
      } 
      else if(that.paddleMove === 'RIGHT'){
        that.paddle.deltaX = 2;
      }
  }); 
  
};

Breakout.prototype.init = function () {
  var that = this;

  this.canvas = $("#canvas")[0];
  this.ctx = canvas.getContext('2d');
  this.backgroundColor = "black";

  Score.init(this.ctx);
  
  this.ball = new Ball(this.ctx,50, 450, 12, 360);
  this.ball.color = "red";

  this.paddle =  new  Paddle(this.ctx,40, 500,  80, 20,"orange");
  
  this.bricks = [
        [1,2,1,3,2,1,2,2],
        [1,1,2,1,0,3,1,1],
        [2,1,3,1,2,1,0,1],
        [3,2,2,2,0,2,1,1]
      ];

  

       this.bricks = [
        [0,0,0,0,3,3,3,3],
        [0,0,0,0,3,3,3,3],
        [0,0,0,0,3,3,3,3],
        [0,0,0,0,3,3,3,3]
      ];

       this.bricks = [
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3]
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

  this.ballObjects = [];

  this.ballObjects.push(this.ball);   

  clearInterval(that.gameLoop);

  that.gameLoop = setInterval((function(self) {
    return function () {
      self.animate(self);
    }
  })(that), 1000/60);
};

Breakout.prototype.endGame = function (that) {
   clearInterval(that.gameLoop);
   that.gameLoop = null;
   that.gameOver = true;

   $(document).off();  // disable all events on the documents.
   that.captureKeys();
   return;
};


Breakout.prototype.draw = function () {
  this.paddle.draw(this.ctx);

  var bricks = this.brickObjects;
  for (var i = 0; i < bricks.length; i++) {
    if (!bricks[i].isActive) {
        bricks[i].color = this.backgroundColor;
    }
    bricks[i].draw(this.ctx);
    
  }

  for(var i = 0; i < this.ballObjects.length; i++) {
    this.ballObjects[i].move();
  }
  
  Score.update();


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

Breakout.prototype.animate = function(self) {
  if (self.gameOver) {
    this.endGame(self);
    return;
  }

  this.checkBallToBricksCollision();
  
  this.draw(); 
  this.movePaddle(this.paddle.dir,this.paddle.deltaX);

  this.checkBallToPaddleCollision();
  this.checkBallToWallCollision();
  this.checkBallToBricksCollision();

  if (this.game.checkWinner()) {
    this.gameOver = true;
    this.clear();
    this.winMessage();
    Score.update();
  }

  this.handleBallCollision();
};

Breakout.prototype.movePaddle = function(dir, delta) {
   if (this.isPaused) {
      return;
   }
   if (this.paddle.x < 10) {
      this.paddle.deltaX = 0;
   }
  
   if (this.paddle.x > 500) {
      this.paddle.deltaX = 0;
   }

   if (this.paddle.x < 10 && dir === 'RIGHT') {
      this.paddle.deltaX = delta || 5;
   }
   else if (this.paddle.x > 500 && dir === 'LEFT') {
      this.paddle.deltaX = delta || -5;
   }
   this.paddle.move(dir);
   this.checkBallToPaddleCollision();

};

Breakout.prototype.incrementScore = function (value, ball) {
  var increment = 10;
  switch(value) {
    case 0:
      break;
    case 1:
      increment = 10;
      break;
    case 2:
      increment = 12;
      break;
    case 3:
      increment = 15;
      var ball = new Ball(this.ctx, this.randomRange(10,590), this.randomRange(80,400), 12, 360);
      ball.color = Color.getRandomColor();
      ball.isPrimary = false;
      ball.ctx = this.ctx;
      ball.deltaX = -1;
      ball.deltaY = -2;
      this.ballObjects.push(ball);
      break;
  }
  if (!ball.isPrimary) {
    increment += 10;
  }
  Score.increment(increment);
};

Breakout.prototype.checkBallToBricksCollision = function() {
  var bricks = this.brickObjects;

  for (var i = 0; i < bricks.length; i++) {
    for (var ballIndex = 0; ballIndex < this.ballObjects.length; ballIndex++) {
      if (this.ballObjects[ballIndex].getYBounds() <= bricks[i].y + bricks[i].height){
       if (this.ballObjects[ballIndex].getXBounds() >= bricks[i].x && 
            this.ballObjects[ballIndex].getXBounds() <= bricks[i].x + bricks[i].width) {
            
            if (bricks[i].isActive) {
              //this.breakingSound.play();
              this.ballObjects[ballIndex].deltaY = -this.ballObjects[ballIndex].deltaY;
              bricks[i].isActive = false;
              
              this.ballObjects[ballIndex].backgroundColor = bricks[i].color; // todo

              this.incrementScore(bricks[i].value, this.ballObjects[ballIndex]);
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
          //this.bouncingSound.play();
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

Breakout.prototype.handleBallCollision = function () {
  for(var i = 0; i < this.ballObjects.length-1; i++) {  
    for(var j = 1; j < this.ballObjects.length; j++) {  
        this.checkBallCollision(this.ballObjects[i], this.ballObjects[j]);
    }  
  }  
}

Breakout.prototype.checkBallCollision = function (ball0, ball1) {
  var dx = ball1.x - ball0.x,
      dy = ball1.y - ball0.y,
      dist = Math.sqrt(dx * dx + dy * dy);
      
      //collision handling code here
      if (dist < ball0.radius + ball1.radius) {
            ball0.deltaX = ball0.deltaX * -1;
            ball1.deltaX = ball1.deltaX * -1;
      }
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
        if (this.ballObjects[index].isPrimary) {
           this.clear();

           this.lostMessage();
          
           this.gameOver = true;
           this.endGame(this);
           Score.update();
        }
        else {
          this.ballObjects[index].clear();
          this.ballObjects.remove(index);
        }
      }
    }
};

