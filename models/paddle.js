var Paddle = function (x,y,width,height,color) {
      this.color = color;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;

      this.deltaX = 10;
  };

  Paddle.prototype.draw = function (ctx) {
     this.ctx = this.ctx || ctx;
     this.ctx.fillStyle = this.color;
     this.ctx.fillRect(this.x,this.y,this.width, this.height);
  };

  Paddle.prototype.getBounds = function () {
     //return new Rect(this.x, this.y, this.x + this.width, this.y + this.height);
  };

  Paddle.prototype.move = function (dir) {
    this.clear();
    if (dir === 'LEFT') {
      this.x = this.x - 1 * Math.abs(this.deltaX);
    }
    
    if (dir === 'RIGHT') {
      this.x = this.x +  1 * Math.abs(this.deltaX);
    }
    this.draw(this.ctx);
  };

  Paddle.prototype.clear = function () {
    this.fillStyle = "white";
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  };
    