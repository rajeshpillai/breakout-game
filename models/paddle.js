var Paddle = function (ctx,x,y,width,height,color) {
      this.ctx = ctx;
      this.color = color;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.dir = "NONE";
      this.deltaX = 10;
      this.animateStep = 1;
      this.acceleration = 0;
  };

  Paddle.prototype.draw = function () {
     this.ctx.save();
     this.ctx.fillStyle = this.color;
     this.ctx.fillRect(this.x,this.y,this.width, this.height);
     this.ctx.restore();
  };

  Paddle.prototype.getBounds = function () {
     return {x: this.x, y:this.y, x2:this.x + this.width, y2:this.y + this.height};
  };

  Paddle.prototype.move = function (dir) {
    this.dir = dir;
    this.clear();
    if (dir === 'LEFT') {
      this.x = this.x - 1 * Math.abs(this.deltaX + this.acceleration);
    }
    
    if (dir === 'RIGHT') {
      this.x = this.x +  1 * Math.abs(this.deltaX + this.acceleration);
    }
    this.draw();
  };

  Paddle.prototype.clear = function () {
    this.fillStyle = "white";
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  };
    