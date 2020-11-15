const cnv = <HTMLCanvasElement>document.getElementById('cnv'),
	ctx = <CanvasRenderingContext2D>cnv.getContext('2d');

const   seed_input = <HTMLInputElement>document.getElementById('seed_input'),
	      res_input = <HTMLInputElement>document.getElementById('res_input'),
	     pers_input = <HTMLInputElement>document.getElementById('pers_input'),
	   minoct_input = <HTMLInputElement>document.getElementById('minoct_input'),
	   maxoct_input = <HTMLInputElement>document.getElementById('maxoct_input'),
	    time_output = <HTMLOutputElement>document.getElementById('time_output');

seed_input.onchange
= res_input.onchange
= pers_input.onchange
= minoct_input.onchange
= maxoct_input.onchange
= onParamsChange;

function onParamsChange() {
	seed = parseFloat(seed_input.value);
	if (isNaN(seed)) {
		seed = Date.now();
		seed_input.value = '';
	}

	res = Math.round(Math.log2(parseFloat(res_input.value)));
	res_input.value = (2 ** res).toString();

	pers = parseFloat(pers_input.value);

	minoct = Math.max(0, parseInt(minoct_input.value));
	minoct_input.value = minoct.toString();

	maxoct = Math.min(res - 1, parseInt(maxoct_input.value));
	maxoct_input.value = maxoct.toString();

	time_output.value = '';
}

function runNoise() {
	let ts = performance.now();
	const noiseData = valueNoise1D(seed, res, pers, minoct, maxoct, lerp);
	time_output.value = (performance.now() - ts).toFixed(3);
	drawCanvas(noiseData);
	if (!seed_input.value)
		seed = Date.now();
}

function drawCanvas(data: number[]) {
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(0, (-data[0] + 1) * cnv.height)
	for (let i = 0; i < data.length; i++)
		ctx.lineTo(i / data.length * cnv.width, (-data[i] + 1) * cnv.height);
	ctx.stroke();
}