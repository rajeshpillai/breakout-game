Brick = function (x,y,width,height,color) {
      this.color = color;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.isActive = true;
      this.value = 0;
      this.backgroundColor = "black";
};

Brick.prototype.setColor = function () {
   switch(this.value) {
         case 0:
            this.isActive = false;
            this.color = "black";
            this.value = 0;
            break;
         case 1:
            this.color = "gray";
            this.value = 1;
            break;
         case 2:
            this.color = "lime";
            this.value = 2;
            break;
         case 3:
            this.color = "green";
            this.value = 3;
            break;
      }
}

Brick.prototype.draw = function (ctx) {
   this.ctx = this.ctx || ctx;

   this.ctx.save();
   this.setColor();

   this.ctx.fillStyle = this.color;
   this.ctx.fillRect(this.x,this.y,this.width, this.height);
   this.ctx.strokeRect(this.x, this.y, this.width,this.height);
   if (this.isActive) {
      //this.ctx.strokeRect(this.x+1,this.y+1,this.width-2,this.height-2);
      if (this.value === 3) {
         this.drawStar(this.ctx);
      }
   }
   this.ctx.restore();
};

Brick.prototype.drawStar = function (ctx) {
    this.ctx = ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x+10, this.y+10, 5, 0, 360 *  Math.PI/180, true);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore(); 
  };

Brick.prototype.getBounds = function () {
   return { x: this.x, y:this.y, x1:this.x + this.width, y1:this.y + this.height };
};

Brick.prototype.clear = function () {
  this.fillStyle = this.backgroundColor;
  this.ctx.clearRect(this.x, this.y, this.width, this.height);
  this.ctx.clearRect(this.x+1,this.y+1,this.width-2,this.height-2);
};
  