var Ball = function (x,y, radius, angle) {
    this.x = x;
    this.y = y;
    this.deltaX = -2;
    this.deltaY = -4;
    this.backgroundColor = "black";
    this.radius = radius;
    this.angle = angle * Math.PI/180;
    this.color = "red";
  };

  Ball.prototype.getXBounds = function () {
     return (this.x + this.deltaX);
  };

   Ball.prototype.getYBounds = function () {
     return (this.y + this.deltaY + this.radius);
  };

  Ball.prototype.draw = function (ctx) {
    this.ctx = ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.angle, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke(); 
  };

  Ball.prototype.move = function () {
    //console.log(this.backgroundColor);
    this.clear();

    this.x = this.x + this.deltaX;
    this.y = this.y + this.deltaY;
    this.draw(this.ctx);
  };

  Ball.prototype.clear = function () {
    this.ctx.save();
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.beginPath();
    this.ctx.clearRect(this.x - this.radius - 1, this.y - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
    this.ctx.closePath();
    this.ctx.restore();
  };