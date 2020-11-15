"use strict";
const cnv = document.getElementById('cnv'), ctx = cnv.getContext('2d');
const seed_input = document.getElementById('seed_input'), res_input = document.getElementById('res_input'), pers_input = document.getElementById('pers_input'), minoct_input = document.getElementById('minoct_input'), maxoct_input = document.getElementById('maxoct_input'), time_output = document.getElementById('time_output');
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
    res_input.value = (Math.pow(2, res)).toString();
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
function drawCanvas(data) {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, (-data[0] + 1) * cnv.height);
    for (let i = 0; i < data.length; i++)
        ctx.lineTo(i / data.length * cnv.width, (-data[i] + 1) * cnv.height);
    ctx.stroke();
}
var seed = Date.now(), res = 9, pers = .5, minoct = 0, maxoct = 8;
const lerp = (x, y0, y1) => (y1 - y0) * x + y0;
function random(seed) {
    return (1103515245 * seed + 12345) % 2147483648;
}
function valueNoise1D(seed, res, pers, minoct = 0, maxoct = res - 1, interp = lerp) {
    const fac = (1 - pers) / (1 - Math.pow(pers, (maxoct - minoct + 1)));
    const rnd = () => {
        seed = random(seed);
        return seed / 2147483648;
    };
    rnd();
    let ret = new Array(Math.pow(2, res)).fill(0);
    for (let i = 0; i <= maxoct - minoct; i++) {
        const num = Math.pow(2, (minoct + i + 1)), sub = ret.length / (num - 1);
        const oct = new Array(num);
        for (let j = 0; j < num; j++)
            oct[j] = rnd() * fac * Math.pow(pers, i);
        for (let j = 0; j < ret.length; j++)
            ret[j] += interp(j % sub / sub, oct[Math.floor(j / sub)], oct[Math.floor(j / sub + 1)]);
    }
    return ret;
}
