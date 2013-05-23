self.addEventListener('message', function(e) {
	process(e);
});

function process(e) {
	var imageData = e.data.data;
	var offset = e.data.offset;
	var rColor = e.data.rColor;
	var gColor = e.data.gColor;
	var bColor = e.data.bColor;
	var bw = e.data.bw;
	var rColor, gColor, bColor, rrColor, ggColor, bbColor, avg, y
			//,resetColor = hex2rgb(document.querySelector('#fillColor').value),
	;
	
	for (var index = 0; index < imageData.data.length; index+=4) {
		rrColor = imageData.data[index];
		ggColor = imageData.data[index+1];
		bbColor = imageData.data[index+2];
		
		if( ! isColorInRange({
			r:rrColor, g:ggColor, b:bbColor
		}, {
			r:rColor, g:gColor, b:bColor
		}, offset)) {
			avg = ((rrColor + ggColor + bbColor) / 3) * bw;

			// y = 0.21*rrColor + 0.72*ggColor + 0.07*bbColor;
			// if (y===1) { avg *= 1.5; }
			// else if (y>0 && y<1) { avg *= 0.9; }
			// else if(y===0) { avg *= 0.3; }

			imageData.data[index] = avg;
			imageData.data[index+1] = avg;
			imageData.data[index+2] = avg;				
		}
		else {
			// imageData.data[index] = resetColor[0];
			// imageData.data[index+1] = resetColor[1];
			// imageData.data[index+2] = resetColor[2];
		}

	}

	self.postMessage({
		colors: imageData
	});
};


function isColorInRange(colorData, colorFilter, offset) {
	
	// if(colorFilter.r + offset > 255 || colorFilter.g + offset > 255 || colorFilter.b + offset > 255){ 
	// 	return false; 
	// }
	// if(colorFilter.r - offset < 0 || colorFilter.g - offset < 0 || colorFilter.b - offset < 0){ 
	// 	return false; 
	// }
	
	return ((colorFilter.r - offset < colorData.r) && (colorFilter.r  >= colorData.r) 
					&& (colorFilter.g - offset < colorData.g) &&  (colorFilter.g >=  colorData.g)
					&& (colorFilter.b - offset < colorData.b) && (colorFilter.b  >= colorData.b));
	// return ((colorFilter.r + offset >= colorData.r) && (colorFilter.r  < colorData.r) 
	// 				&& (colorFilter.g + offset >= colorData.g) &&  (colorFilter.g <  colorData.g)
	// 				&& (colorFilter.b + offset >= colorData.b) && (colorFilter.b  < colorData.b));
}

function contrastRatio() {
	var RsRGB;
	var GsRGB;
	var BsRGB; 

	if (RsRGB <= 0.03928) { r = RsRGB/12.92; } else { r = ((RsRGB+0.055)/1.055); Math.pow(r, 2.4); }
	if (GsRGB <= 0.03928) { g = GsRGB/12.92; } else { g = ((GsRGB+0.055)/1.055); Math.pow(g, 2.4); }
	if (BsRGB <= 0.03928) { b = BsRGB/12.92; } else { b = ((BsRGB+0.055)/1.055); Math.pow(b, 2.4); }

	var l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	var l1;
	var l2;
	return (l1 + 0.05) / (l2 + 0.05);
}
