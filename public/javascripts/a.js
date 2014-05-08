connected.on('sortstart', function(){
	placeholder.addClass('is-dragging');
	
	doneUl.on('mouseover', function(){
		$(ui).item.addClass('is-done');
	});
	
	deleteUl.on('mouseover', function(){
		$(ui).item.remove();
	});
});