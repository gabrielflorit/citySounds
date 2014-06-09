function playSound(frequency, waitDuration) {
	var osc = tsw.oscillator(frequency);

	tsw.connect(osc, tsw.speakers);

	osc.start(tsw.now() + waitDuration);
}

var scale = ['C', 'E', 'G', 'B'];

for (var i = 0; i < scale.length; i++) {
	playSound(tsw.frequency(scale[i] + '4'), i*1);
}