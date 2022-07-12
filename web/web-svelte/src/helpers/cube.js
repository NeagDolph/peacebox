export function cube(size) {
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
		[-h, h, h],

		[h, h, h],
		[h, h, -h],
		[h, h, h],

		[h, -h, h],
		[h, -h, -h],
		[h, -h, h],
		[-h, -h, h]
	);

	return position;
}
