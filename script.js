window.addEventListener('load', function(){
	var images = document.querySelectorAll('.image');
	for(var i=0; i<images.length; i+=1){
		images[i].addEventListener('click', function(){
			findPalette(this);
		}, false);
	}
	findPalette(images[0]);
});

function findPalette(DOMimage) {
	var colors = {};
	var image = document.querySelector('#image');
	image.src = DOMimage.src;
	var colorsPalette = document.querySelector('#colorsPalette');
	var children = colorsPalette.children;
	while(children.length>0){
		children[0].remove();
	}
	var canvas = document.querySelector('#canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0,0, image.width, image.height);
	var pixels = ctx.getImageData(0,0,canvas.width, canvas.height);
	var worker = new Worker("Analyzer.js");
	worker.onmessage = function (e) {
		var colors = e.data.colors;
		var ln = colors.length;
		var w = image.width / ln;
		for(var i=0; i<ln; i+=1){
			var span = document.createElement('span');
			span.style.display = "inline-block";
			span.style.width = w+"px";
			span.style.height = w+"px";
			span.style.backgroundColor = colors[i];
			colorsPalette.appendChild(span);
		}
		document.querySelector('#result').innerText = "";
	};

	worker.postMessage({
		data: pixels
	});

}
