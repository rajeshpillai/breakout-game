

$(function() {
  
  $(document).on("keyup", start);

	function start(evt) {
	  if (evt.keyCode == 32) {
	    $(".startup").hide();
	    $("#canvas").show();
	  	$(document).off("keyup", start);
	  }
	} 
});
 