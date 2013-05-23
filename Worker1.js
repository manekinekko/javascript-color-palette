importScripts('palette.js');
importScripts('quantize.js');

self.addEventListener('message', function(e) {
	process(e);
});

function process(e) {
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
				str = {
					hex: '#' + val.toString(16),
					rgb: color
				}
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
};