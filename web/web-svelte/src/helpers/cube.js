export default function cube(size) {
	const h = size * 0.5;
	const position = [];

	position.push(
    [-h, -h, -h],
    [-h, h, -h],
    [h, h, -h],
    [h, -h, -h],
    [-h, -h, -h],

    [-h, -h, h],
    [-h, h, h],
    [-h, h, -h],
    // [-h, h, h],

    [h, -h, h],
    [h, -h, -h],
    [-h, h, h],
    [h, h, h],
    [h, -h, h],
    [-h, -h, h],
    [h, h, -h],
    [h, h, h]
    // [h, h, -h],
    // [h, h, h],

    // [h, -h, h],
    // [h, -h, -h],
    // [h, -h, h],
    // [-h, -h, h]
  );

	const newPos = Math.random() > 0.5 ? position : position.reverse();

	return newPos;
}

function cube2(size) {
	const h = size * 0.5;
	const position = [];

	position.push([h, h, -h], [-h, h, -h], [-h, -h, -h], [h, -h, -h]);

	return position;
}

function cube3(size) {
	const h = size * 0.5;
	const position = [];

	position.push([-h, h, h], [-h, h, -h]);

	return position;
}

function cube4(size) {
	const h = size * 0.5;
	const position = [];

	position.push([-h, -h, h], [-h, -h, -h]);

	return position;
}

function cube1(size) {
	const flattenedpre = [cube1(size), cube2(size), cube3(size), cube4(size)];

	const flattened = flattenedpre.reduce((o, el) => o.concat(el), []);
	const fullMap = [];

	flattened.forEach((el, i) => {
		fullMap.push([el, flattened[Math.min(i + 1, flattened.length - 1)]]);
	});

	return fullMap;
}
