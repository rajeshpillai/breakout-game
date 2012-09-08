var Ball = function (x,y, radius, angle) {
    this.x = x;
    this.y = y;
    this.deltaX = -2;
    this.deltaY = -4;

    this.radius = radius;
    this.angle = angle * Math.PI/180;
  };

  Ball.prototype.getBounds = function () {
     return new Rect(this.x, this.y, this.x + this.width, this.y + this.height);
  };

  Ball.prototype.draw = function (ctx) {
    this.ctx = ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.angle, true);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke(); 
  };

  Ball.prototype.move = function () {
    this.ctx.beginPath();
    this.ctx.clearRect(this.x - this.radius - 1, this.y - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
    this.ctx.closePath();

    this.x = this.x + this.deltaX;
    this.y = this.y + this.deltaY;
    this.draw(this.ctx);
  };