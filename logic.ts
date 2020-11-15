var seed = Date.now(),
	res = 10,
	pers = .5,
	minoct = 0,
	maxoct = 9;

// линейная интерполяция
const lerp = (x: number, y0: number, y1: number) => (y1 - y0) * x + y0;

// линейный конгруэнтный генератор случайный чисел
// выводит значения в интервале [0, 2^31)
function random(seed: number): number {
	return (1103515245 * seed + 12345) % 2147483648;
}

function valueNoise1D(seed: number, res: number, pers: number, minoct = 0, maxoct = res - 1, interp = lerp): number[] {
	// коэффицент, чтобы выходные значения оставались в диапазоне [0; 1)
	const fac = (1 - pers) / (1 - pers ** (maxoct - minoct + 1));

	const rnd = () => {
		seed = random(seed);
		return seed / 2147483648;
	};
	rnd();

	let ret = <number[]>new Array(2 ** res).fill(0);

	// для каждой октавы
	for (let i = 0; i <= maxoct - minoct; i++) {
		// num - частота, sub - колво точек между разделениями
		const num = 2 ** (minoct + i + 1),
				sub = ret.length / (num - 1);
		// задание значений октаве
		const oct = new Array(num);
		for (let j = 0; j < num; j++)
			oct[j] = rnd() * fac * pers ** i;
		// интерполяция и сложение
		for (let j = 0; j < ret.length; j++)
			ret[j] += interp(j % sub / sub, oct[Math.floor(j / sub)], oct[Math.floor(j / sub + 1)]);
	}

	return ret;
}