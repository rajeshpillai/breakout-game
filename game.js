// This is the entry point

$(function() {
    $(document).on("keyup", start);
	function start(evt) {
	    if (evt.keyCode === 32) {  // 32 is the 'space' key
	        $(".startup").hide();
	        $("#canvas").show();
	     	$("#canvas-wrapper").show();
	    	$(document).off("keyup", start);
	    }
	} 
});
 