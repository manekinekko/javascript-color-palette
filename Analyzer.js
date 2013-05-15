importScripts('palette.js');
importScripts('quantize.js');

self.addEventListener('message', function(e) {
	var pixels = e.data.data;
	var nbColors = e.data.nbColors;
	var colors = palette(pixels, nbColors || 10);
	var resColors = [], resStats = [];
	colors.map(function(vb) {
		return vb.color;
	}).forEach(function(color){
		var r = color[0], 
				g = color[1], 
				b = color[2], 
				val = r << 16 | g << 8 | b, 
				str = '#' + val.toString(16);
		resColors.push(str);
	});

	colors.map(function(vb){
		return vb.vbox._count;
	}).forEach(function(stat){
		resStats.push(stat);
	});

	self.postMessage({
		colors: resColors,
		stats: resStats
	});
	
});
/*
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}

self.addEventListener('message', function(e) {
	var pixels = e.data.data.data;
	var lng = pixels.length;
	var r, g, b, color, colors = {}, total = 1;

	for (var i = lng - 1; i >= 0; i--) {
		r = pixels[i];
		g = pixels[i+1];
		b = pixels[i+2];
		color = '#' + (r << 16 | g << 8 | b).toString(16);
		if(colors[ color ] === undefined){
			total++;
			colors[ color ] = {
				count: 1
			};
		}
		else {
			colors[ color ].count++;
		}

	}

	self.postMessage({
		"colors": colors,
		"total": total
	});

});*/