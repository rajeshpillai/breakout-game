// The color object: Has some helper methods
var Color = {
	getRandomColor: function () {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;
    },
    getBrighterColor: function (brightness){
	    //6 levels of brightness from 0 to 5, 0 being the darkest
	    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
	    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
	    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return (x/2.0).round()})
	    return "rgb(" + mixedrgb.join(",") + ")";
  	}
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};