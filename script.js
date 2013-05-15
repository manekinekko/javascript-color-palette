(function () {
	var worker = new Worker("Analyzer.js");
	var pixels;

	window.addEventListener('load', function(){
		var images = document.querySelectorAll('.image');
		for(var i=0; i<images.length; i+=1){
			images[i].addEventListener('click', function(){
				findPalette(this);
			}, false);
		}
		findPalette(images[0]);

		bindColorRangeNumber();
	});

	function findPalette(DOMimage) {
		var colors = {};
		var image = document.querySelector('#image');
		image.src = DOMimage.src;

		var canvas = document.querySelector('#canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0,0, image.width, image.height);
		pixels = ctx.getImageData(0,0,canvas.width, canvas.height);

		worker.onmessage = function (e) {
			var colorsPalette = document.querySelector('#colorsPalette');
			var children = colorsPalette.children;
			while(children.length>0){
				children[0].remove();
			}

			var colors = e.data.colors;
			var stats = e.data.stats;
			var ln = colors.length;
			var w = image.width / ln;
			for(var i=0; i<ln; i+=1){
				var span = document.createElement('span');
				span.setAttribute('title', (stats[i]/pixels.data.length)*100);
				span.style.display = "inline-block";
				span.style.width = w+"px";
				span.style.height = "50px";
				span.style.backgroundColor = colors[i];
				colorsPalette.appendChild(span);
			}
		};

		worker.postMessage({
			data: pixels,
			nbColors: document.querySelector('#palette-number').value
		});

	}

	function bindColorRangeNumber(){
		var rangeOutput = document.querySelector('#range-output');
		var rangeSelector = document.querySelector('#palette-number');
		rangeOutput.innerText = rangeSelector.value;
		rangeSelector.addEventListener('change', function(){
			rangeOutput.innerText = this.value;

			setTimeout((function(){
				worker.postMessage({
					data: pixels,
					nbColors: this.value
				});
			}).bind(this), 10);

		});
	}

}());