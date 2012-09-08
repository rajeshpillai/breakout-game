

$(function() {
  
  $(document).on("keyup", start);

	function start(evt) {
	  if (evt.keyCode == 32) {
	    $(".startup").hide();
	    $("#canvas").show();
	  	var breakout = new Breakout();
	  	$(document).off("keyup", start);
	  }
	} 
});
 