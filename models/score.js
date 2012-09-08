var Score = {
	width: 600,
	height:200,
	x:0,
	y:575,
	points: 0,
	ctx: null,
	init: function (ctx) {
		this.ctx = ctx;
		this.points = 0;
	},
	reset: function () {
		this.points = 0;
	},
	increment: function (score) {
		this.points += score;
		this.update();
	},
	update: function () {
		this.clear();
		this.ctx.save();
		this.ctx.font = "12pt Geo";
	 	this.ctx.fillStyle = "yellow";
	 	this.ctx.strokeStyle ="blue";
     	this.ctx.fillRect(this.x,this.y,this.width, 100);
     	this.ctx.fillStyle = "blue";

     	this.ctx.fillText("SCORE: " + this.points , 2, 590);

	 	if (this.points === 0) {
	 		this.ctx.font = "12pt Geo";
			this.ctx.fillText("[PRESS <ENTER> OR <RETURN> KEY TO START THE GAME]", 120, 590);
		}
		
		this.ctx.restore();
	},

	clear: function () {
		this.fillStyle = "yellow";
    	this.ctx.clearRect(0,585, this.width, this.height);
	}

};
