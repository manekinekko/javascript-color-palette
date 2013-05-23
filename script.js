(function () {
	var worker1 = new Worker("Worker1.js");
	var worker2 = new Worker("Worker2.js");
	var pixelsData, pixelsPreview, ctxData, ctxPreview;

	window.addEventListener('load', function(){
		var images = document.querySelectorAll('.image');
		for(var i=0; i<images.length; i+=1){
			images[i].addEventListener('click', function(){
				findPalette(this);
			}, false);
		}
		findPalette(images[0]);

		bindColorRangeNumber();
		bindOffsetRangeNumber();
		bindBWRangNumber();

		document.querySelector('#preview').addEventListener('click', function(){
			copyImageToCanvasPreview(image);
		});
	});

	function findPalette(DOMimage) {
		var colors = {};
		var image = document.querySelector('#image');
		image.src = DOMimage.src;
		pixelsData = copyImageToCanvasData(image);
		pixelsPreview = copyImageToCanvasPreview(image);

		worker1.onmessage = function (e) {
			var colorsPalette = document.querySelector('#colors-palette');
			var children = colorsPalette.children;
			while(children.length>0){
				children[0].remove();
			}

			var colors = e.data.colors;
			var stats = e.data.stats;
			var ln = colors.length;
			var w = image.width / ln;
			var span, c, amout;
			for(var i=0; i<ln; i+=1){
				c = colors[i];
				amout = (stats[i]/pixelsData.data.length)*100
				span = document.createElement('span');
				span.setAttribute('title', ('rgb('+c.rgb+'): ')+amout.toFixed(2)+'%');
				span.setAttribute('data-r', c.rgb[0]);
				span.setAttribute('data-g', c.rgb[1]);
				span.setAttribute('data-b', c.rgb[2]);
				span.addEventListener('click', function(){
					applyFilterColor(this);

					var span = document.querySelector('[data-selected=true]');
					span && span.removeAttribute('data-selected');
					this.setAttribute('data-selected', true);
				});
				span.style.display = "inline-block";
				span.style.width = w+"px";
				span.style.height = "50px";
				span.style.backgroundColor = colors[i].hex;
				colorsPalette.appendChild(span);
			}
		};

		worker1.postMessage({
			data: pixelsData,
			nbColors: document.querySelector('#palette-number').value
		});

	}

	function copyImageToCanvasData(image) {
		var canvas = document.querySelector('#canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		ctxData = canvas.getContext("2d");
		ctxData.drawImage(image, 0,0, image.width, image.height);
		return ctxData.getImageData(0,0,canvas.width, canvas.height);
	}

	function copyImageToCanvasPreview(image) {
		image = image || document.querySelector('#image');
		var canvas = document.querySelector('#preview');
		canvas.width = image.width;
		canvas.height = image.height;
		ctxPreview = canvas.getContext("2d");
		ctxPreview.drawImage(image, 0,0, image.width, image.height);
		return ctxPreview.getImageData(0,0,canvas.width, canvas.height);
	}

	function bindOffsetRangeNumber() {
		var timer;
		var rangeOutput = document.querySelector('#offset-output');
		var rangeSelector = document.querySelector('#offset');
		rangeOutput.innerText = rangeSelector.value;
		rangeSelector.addEventListener('change', function(){
			rangeOutput.innerText = this.value;

			var span = document.querySelector('[data-selected=true]');
			if(span) {

				if(timer){
					clearTimeout(timer);
				}

				timer = setTimeout((function(){
					worker2.postMessage({
						data: pixelsData,
						rColor: +span.getAttribute('data-r'),
						gColor: +span.getAttribute('data-g'),
						bColor: +span.getAttribute('data-b'),
						offset: this.value,
						bw: document.querySelector('#bw').value
					});
				}).bind(this), 400);
				
			}

		});
	}

	function bindColorRangeNumber(){
		var timer;
		var rangeOutput = document.querySelector('#range-output');
		var rangeSelector = document.querySelector('#palette-number');
		rangeOutput.innerText = rangeSelector.value;
		rangeSelector.addEventListener('change', function(){
			rangeOutput.innerText = this.value;

			if(timer){
				clearTimeout(timer);
			}

			timer = setTimeout((function(){
				worker1.postMessage({
					data: pixelsData,
					nbColors: this.value
				});
			}).bind(this), 400);
		});
	}

	function bindBWRangNumber() {
		var timer;
		var rangeSelector = document.querySelector('#bw');
		rangeSelector.addEventListener('change', function(){
			var span = document.querySelector('[data-selected=true]');
			if(span) {

				if(timer){
					clearTimeout(timer);
				}

				timer = setTimeout((function(){
					worker2.postMessage({
						data: pixelsData,
						rColor: +span.getAttribute('data-r'),
						gColor: +span.getAttribute('data-g'),
						bColor: +span.getAttribute('data-b'),
						bw: this.value,
						offset: document.querySelector('#offset').value
					});
				}).bind(this), 400);
				
			}

		});	
	}

	function applyFilterColor(span){
		worker2.onmessage = function(e) {
			ctxPreview.putImageData(e.data.colors, 0, 0);
		}
		worker2.postMessage({
			data: copyImageToCanvasPreview(),
			rColor: +span.getAttribute('data-r'),
			gColor: +span.getAttribute('data-g'),
			bColor: +span.getAttribute('data-b'),
			bw: +document.querySelector('#bw').value,
			offset: +document.querySelector('#offset').value
		})
	}


	function hex2rgb(hex) {
		hex = hex.replace('#', '');
		return ['0x' + hex[0] + hex[1] | 0, '0x' + hex[2] + hex[3] | 0, '0x' + hex[4] + hex[5] | 0];
	}

}());