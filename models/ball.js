// The Ball object
var Ball = function (ctx,x,y, radius, angle) {
    var self = this;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.deltaX = -2;
    this.deltaY = -4;
    this.backgroundColor = "black";
    this.radius = radius;
    this.angle = angle * Math.PI/180;
    this.color = "red";
    this.isPrimary = true;
    this.nextx = 0;
    this.nexty = 0;

    this.sprite = new Image();

    //drawing of the test image - sprite
    this.sprite.onload = function () {
        //draw background image
        //self.ctx.drawImage(self.sprite, 0, 0);
    };

    this.sprite.src = './assets/pokeball.png';

    console.log("sprite: ", this.sprite);
  };

  Ball.prototype.nextx = function () {
    this.nextx = (this.x += this.deltaX);
    return this.nextx;
  };

  Ball.prototype.nexty = function () {
    this.nexty = (this.y += this.deltaY);
    return this.nexty;
  };


  Ball.prototype.getXBounds = function () {
     return (this.x + this.deltaX);
  };

  Ball.prototype.getYBounds = function () {
     return (this.y + this.radius);
  };

  Ball.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.save();

    if(this.sprite) {
      ctx.drawImage(this.sprite, this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, this.angle, true);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.stroke(); 
    }

    if (this.isPrimary) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(this.x, this.y, this.radius/4, 0, this.angle, true);
      ctx.fill();
      this.drawStar(ctx, this.x, this.y, 20, 5, 0.1)
    }
    ctx.restore();
  };

  // Draw the ball with a start (not actually, but an ellipse)
  Ball.prototype.drawStar = function (ctx, x, y, r, p, m) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0,0-r);
    for (var i = 0; i < p; i++)
    {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r*m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
    }
    ctx.fill();
    ctx.restore();
  };

 
  Ball.prototype.move = function () {
    //this.clear();
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

    // todo: if image, clear
  };