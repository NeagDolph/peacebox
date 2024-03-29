import * as THREE from "three";

function prerunFireworks(canvas, document) {
	var Fireworks = {
		debug: !0,
		EffectsStackBuilder: function (a) {
			this._emitter = a;
		}
	};
	Fireworks.EffectsStackBuilder.prototype.emitter = function () {
		return this._emitter;
	};
	Fireworks.EffectsStackBuilder.prototype.back = function () {
		return this._emitter;
	};
	Fireworks.EffectsStackBuilder.prototype.createEffect = function (a, b) {
		var c = Fireworks.createEffect(a, b).pushTo(this._emitter).back(this);
		c.effect().emitter(this._emitter);
		return c;
	};
	Fireworks.createEffect = function (a, b) {
		'object' === typeof a && ((b = a), (a = void 0));
		var c = new Fireworks.Effect();
		c.opts = b;
		c.name = a;
		c.back = null;
		var d = {
			onCreate: function (a) {
				c.onCreate = a;
				return d;
			},
			onBirth: function (a) {
				c.onBirth = a;
				return d;
			},
			onUpdate: function (a) {
				c.onUpdate = a;
				return d;
			},
			onDeath: function (a) {
				c.onDeath = a;
				return d;
			},
			onPreUpdate: function (a) {
				c.onPreUpdate = a;
				return d;
			},
			onPreRender: function (a) {
				c.onPreRender = a;
				return d;
			},
			onRender: function (a) {
				c.onRender = a;
				return d;
			},
			onPostRender: function (a) {
				c.onPostRender = a;
				return d;
			},
			onIntensityChange: function (a) {
				c.onIntensityChange = a;
				return d;
			},
			pushTo: function (a) {
				a.effects().push(c);
				return d;
			},
			back: function (a) {
				if (void 0 === a) return c.back;
				c.back = a;
				return d;
			},
			effect: function () {
				return c;
			}
		};
		return d;
	};
	Fireworks.Effect = function () {
		this._emitter = null;
	};
	Fireworks.Effect.prototype.destroy = function () {};
	Fireworks.Effect.prototype.emitter = function (a) {
		if (void 0 === a) return this._emitter;
		this._emitter = a;
		return this;
	};
	Fireworks.createEmitter = function (a) {
		return new Fireworks.Emitter(a);
	};
	Fireworks.Emitter = function (a) {
		this._nParticles = void 0 !== a.nParticles ? a.nParticles : 100;
		this._particles = [];
		this._effects = [];
		this._started = !1;
		this._onUpdated = null;
		this._intensity = 0;
		this._maxDeltaTime = 1 / 3;
		this._effectsStackBuilder = new Fireworks.EffectsStackBuilder(this);
	};
	Fireworks.Emitter.prototype.destroy = function () {
		this._effects.forEach(function (a) {
			a.destroy();
		});
		this._particles.forEach(function (a) {
			a.destroy();
		});
	};
	Fireworks.Emitter.prototype.effects = function () {
		return this._effects;
	};
	Fireworks.Emitter.prototype.effect = function (a) {
		for (var b = 0; b < this._effects.length; b++) {
			var c = this._effects[b];
			if (c.name === a) return c;
		}
		return null;
	};
	Fireworks.Emitter.prototype.particles = function () {
		return this._particles;
	};
	Fireworks.Emitter.prototype.liveParticles = function () {
		return this._liveParticles;
	};
	Fireworks.Emitter.prototype.deadParticles = function () {
		return this._deadParticles;
	};
	Fireworks.Emitter.prototype.nParticles = function () {
		return this._nParticles;
	};
	Fireworks.Emitter.prototype.effectsStackBuilder = function () {
		return this._effectsStackBuilder;
	};
	Fireworks.Emitter.prototype.intensity = function (a) {
		if (void 0 === a) return this._intensity;
		if (a === this._intensity) return this;
		Fireworks.debug && console.assert(0 <= a, 'Fireworks.Emitter.intensity: invalid value.', a);
		Fireworks.debug && console.assert(1 >= a, 'Fireworks.Emitter.intensity: invalid value.', a);
		var b = this._intensity;
		this._intensity = a;
		this._effects.forEach(
			function (a) {
				if (a.onIntensityChange) a.onIntensityChange(this._intensity, b);
			}.bind(this)
		);
		return this;
	};
	Fireworks.Emitter.prototype.maxDeltaTime = function (a) {
		if (void 0 === a) return this._maxDeltaTime;
		this._maxDeltaTime = a;
		return this;
	};
	Fireworks.Emitter.prototype.setParticleData = function (a, b, c) {
		a[b] = c;
	};
	Fireworks.Emitter.prototype.getParticleData = function (a, b) {
		return a[b];
	};
	Fireworks.Emitter.prototype.start = function () {
		console.assert(0 < this._effects.length, 'At least one effect MUST be set');
		console.assert(!1 === this._started);
		this._particles = Array(this._nParticles);
		for (var a = 0; a < this._nParticles; a++) this._particles[a] = new Fireworks.Particle();
		this._liveParticles = [];
		this._deadParticles = this._particles.slice(0);
		this._started = !0;
		this._effects.forEach(
			function (a) {
				a.onCreate &&
					this._particles.forEach(function (c, d) {
						a.onCreate(c, d);
					});
			}.bind(this)
		);
		this.intensity(1);
		return this;
	};
	Fireworks.Emitter.prototype.update = function (a) {
		a = Math.min(this._maxDeltaTime, a);
		this._effects.forEach(
			function (b) {
				if (b.onPreUpdate) b.onPreUpdate(a);
			}.bind(this)
		);
		this._effects.forEach(
			function (b) {
				b.onUpdate &&
					this._liveParticles.forEach(function (c) {
						b.onUpdate(c, a);
					});
			}.bind(this)
		);
		return this;
	};
	Fireworks.Emitter.prototype.render = function () {
		this._effects.forEach(
			function (a) {
				if (a.onPreRender) a.onPreRender();
			}.bind(this)
		);
		this._effects.forEach(
			function (a) {
				a.onRender &&
					this._liveParticles.forEach(function (b) {
						a.onRender(b);
					});
			}.bind(this)
		);
		this._effects.forEach(
			function (a) {
				if (a.onPostRender) a.onPostRender();
			}.bind(this)
		);
		return this;
	};
	Fireworks.Emitter.prototype.killParticle = function (a) {
		var b = this._liveParticles.indexOf(a);
		Fireworks.debug && console.assert(-1 !== b);
		this._liveParticles.splice(b, 1);
		this._deadParticles.push(a);
		this.effects().forEach(
			function (b) {
				b.onDeath && b.onDeath(a);
			}.bind(this)
		);
	};
	Fireworks.Emitter.prototype.spawnParticle = function () {
		Fireworks.debug &&
			console.assert(1 <= this._deadParticles.length, 'no more particle available');
		var a = this.deadParticles().pop();
		this.liveParticles().push(a);
		this.effects().forEach(
			function (b) {
				b.onBirth && b.onBirth(a);
			}.bind(this)
		);
	};
	Fireworks.createLinearGradient = function (a) {
		return new Fireworks.LinearGradient(a);
	};
	Fireworks.LinearGradient = function () {
		this._keyPoints = [];
	};
	Fireworks.LinearGradient.prototype.push = function (a, b) {
		this._keyPoints.push({ x: a, y: b });
		return this;
	};
	Fireworks.LinearGradient.prototype.get = function (a) {
		for (var b = 0; b < this._keyPoints.length && !(a <= this._keyPoints[b].x); b++);
		if (0 === b) return this._keyPoints[0].y;
		Fireworks.debug && console.assert(b < this._keyPoints.length);
		var c = this._keyPoints[b - 1],
			b = this._keyPoints[b];
		return c.y + ((a - c.x) / (b.x - c.x)) * (b.y - c.y);
	};
	Fireworks.Particle = function () {};
	Fireworks.Particle.prototype.set = function (a, b) {
		Fireworks.debug && console.assert(void 0 === this[a], 'key already defined: ' + a);
		this[a] = b;
		return this[a];
	};
	Fireworks.Particle.prototype.get = function (a) {
		Fireworks.debug && console.assert(void 0 !== this[a], 'key undefined: ' + a);
		return this[a];
	};
	Fireworks.Particle.prototype.has = function (a) {
		return void 0 !== this[a] ? !0 : !1;
	};
	Fireworks.Shape = function () {};
	Fireworks.createVector = function (a, b, c) {
		return new Fireworks.Vector(a, b, c);
	};
	Fireworks.Vector = function (a, b, c) {
		this.x = a || 0;
		this.y = b || 0;
		this.z = c || 0;
	};
	Fireworks.Vector.prototype = {
		constructor: Fireworks.Vector,
		set: function (a, b, c) {
			this.x = a;
			this.y = b;
			this.z = c;
			return this;
		},
		setX: function (a) {
			this.x = a;
			return this;
		},
		setY: function (a) {
			this.y = a;
			return this;
		},
		setZ: function (a) {
			this.z = a;
			return this;
		},
		random: function () {
			this.x = Math.random() - 0.5;
			this.y = Math.random() - 0.5;
			this.z = Math.random() - 0.5;
			return this;
		},
		toString: function () {
			return JSON.stringify(this);
		},
		copy: function (a) {
			this.x = a.x;
			this.y = a.y;
			this.z = a.z;
			return this;
		},
		add: function (a, b) {
			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			return this;
		},
		addSelf: function (a) {
			this.x += a.x;
			this.y += a.y;
			this.z += a.z;
			return this;
		},
		addScalar: function (a) {
			this.x += a;
			this.y += a;
			this.z += a;
			return this;
		},
		sub: function (a, b) {
			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			return this;
		},
		subSelf: function (a) {
			this.x -= a.x;
			this.y -= a.y;
			this.z -= a.z;
			return this;
		},
		multiply: function (a, b) {
			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;
			return this;
		},
		multiplySelf: function (a) {
			this.x *= a.x;
			this.y *= a.y;
			this.z *= a.z;
			return this;
		},
		multiplyScalar: function (a) {
			this.x *= a;
			this.y *= a;
			this.z *= a;
			return this;
		},
		divideSelf: function (a) {
			this.x /= a.x;
			this.y /= a.y;
			this.z /= a.z;
			return this;
		},
		divideScalar: function (a) {
			a ? ((this.x /= a), (this.y /= a), (this.z /= a)) : (this.z = this.y = this.x = 0);
			return this;
		},
		negate: function () {
			return this.multiplyScalar(-1);
		},
		dot: function (a) {
			return this.x * a.x + this.y * a.y + this.z * a.z;
		},
		lengthSq: function () {
			return this.x * this.x + this.y * this.y + this.z * this.z;
		},
		length: function () {
			return Math.sqrt(this.lengthSq());
		},
		normalize: function () {
			return this.divideScalar(this.length());
		},
		setLength: function (a) {
			return this.normalize().multiplyScalar(a);
		},
		cross: function (a, b) {
			this.x = a.y * b.z - a.z * b.y;
			this.y = a.z * b.x - a.x * b.z;
			this.z = a.x * b.y - a.y * b.x;
			return this;
		},
		crossSelf: function (a) {
			var b = this.x,
				c = this.y,
				d = this.z;
			this.x = c * a.z - d * a.y;
			this.y = d * a.x - b * a.z;
			this.z = b * a.y - c * a.x;
			return this;
		},
		distanceTo: function (a) {
			return Math.sqrt(this.distanceToSquared(a));
		},
		distanceToSquared: function (a) {
			return new Fireworks.Vector().sub(this, a).lengthSq();
		},
		equals: function (a) {
			return a.x === this.x && a.y === this.y && a.z === this.z;
		},
		isZero: function () {
			return 1e-4 > this.lengthSq();
		},
		clone: function () {
			return new Fireworks.Vector(this.x, this.y, this.z);
		}
	};
	Fireworks.EffectsStackBuilder.prototype.acceleration = function (a) {
		a = a || {};
		var b = a.effectId || 'acceleration';
		console.assert(a.shape instanceof Fireworks.Shape);
		Fireworks.createEffect(b, { shape: a.shape })
			.onCreate(function (a) {
				a.acceleration = { vector: new Fireworks.Vector() };
			})
			.onBirth(function (a) {
				this.opts.shape.randomPoint(a.acceleration.vector);
			})
			.onUpdate(function (a, b) {
				var f = a.velocity.vector,
					e = a.acceleration.vector;
				f.x += e.x * b;
				f.y += e.y * b;
				f.z += e.z * b;
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.friction = function (a) {
		a = void 0 !== a ? a : 1;
		console.assert(0 <= a && 1 >= a);
		Fireworks.createEffect('friction')
			.onCreate(function (b) {
				b.friction = { value: a };
			})
			.onBirth(function (b) {
				b.friction.value = a;
			})
			.onUpdate(function (a) {
				a.velocity.vector.multiplyScalar(a.friction.value);
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.lifeTime = function (a, b) {
		console.assert(void 0 !== a);
		void 0 === b && (b = a);
		console.assert(void 0 !== b);
		var c = this._emitter;
		Fireworks.createEffect('lifeTime', { minAge: a, maxAge: b })
			.onCreate(function (a) {
				var b = (a.lifeTime = {
					curAge: 0,
					minAge: 0,
					maxAge: 0,
					normalizedAge: function () {
						return (b.curAge - b.minAge) / (b.maxAge - b.minAge);
					}
				});
			})
			.onBirth(function (a) {
				a = a.lifeTime;
				a.curAge = 0;
				a.maxAge = this.opts.minAge + Math.random() * (this.opts.maxAge - this.opts.minAge);
			})
			.onUpdate(function (a, b) {
				var e = a.lifeTime;
				e.curAge += b;
				e.curAge > e.maxAge && c.killParticle(a);
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.position = function (a) {
		console.assert(a instanceof Fireworks.Shape);
		Fireworks.createEffect('position', { shape: a })
			.onCreate(function (a) {
				a.position = { vector: new Fireworks.Vector() };
			})
			.onBirth(function (a) {
				this.opts.shape.randomPoint(a.position.vector);
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.radialVelocity = function (a, b) {
		Fireworks.createEffect('radialVelocity', { minSpeed: a, maxSpeed: b })
			.onCreate(function (a) {
				a.velocity = { vector: new Fireworks.Vector() };
			})
			.onBirth(function (a) {
				var b = a.position.vector;
				a = a.velocity.vector;
				var f = this.opts.minSpeed + (this.opts.maxSpeed - this.opts.minSpeed) * Math.random();
				a.copy(b).setLength(f);
			})
			.onUpdate(function (a, b) {
				var f = a.position.vector,
					e = a.velocity.vector;
				f.x += e.x * b;
				f.y += e.y * b;
				f.z += e.z * b;
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.randomVelocityDrift = function (a) {
		Fireworks.createEffect('randomVelocityDrift', { drift: a })
			.onUpdate(function (a, c) {
				var d = a.velocity.vector;
				d.x += (2 * Math.random() - 1) * this.opts.drift.x * c;
				d.y += (2 * Math.random() - 1) * this.opts.drift.y * c;
				d.z += (2 * Math.random() - 1) * this.opts.drift.z * c;
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.velocity = function (a, b) {
		Fireworks.createEffect('velocity', { shape: a, speed: void 0 !== b ? b : -1 })
			.onCreate(function (a) {
				a.velocity = { vector: new Fireworks.Vector() };
			})
			.onBirth(function (a) {
				a = a.velocity.vector;
				this.opts.shape.randomPoint(a);
				-1 !== this.opts.speed && a.setLength(this.opts.speed);
			})
			.onUpdate(function (a, b) {
				var f = a.position.vector,
					e = a.velocity.vector;
				f.x += e.x * b;
				f.y += e.y * b;
				f.z += e.z * b;
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.createShapeBox = function (a, b, c, d, f, e) {
		a = new Fireworks.Vector(a, b, c);
		d = new Fireworks.Vector(d, f, e);
		return new Fireworks.Shape.Box(a, d);
	};
	Fireworks.Shape.Box = function (a, b) {
		this.position = a;
		this.size = b;
		this._vector = new Fireworks.Vector();
	};
	Fireworks.Shape.Box.prototype = new Fireworks.Shape();
	Fireworks.Shape.Box.prototype.constructor = Fireworks.Shape.Box;
	Fireworks.Shape.Box.prototype.contains = function (a) {
		a = this._vector.sub(a, this.position);
		return Math.abs(a.x) > this.size.x / 2 ||
			Math.abs(a.y) > this.size.y / 2 ||
			Math.abs(a.z) > this.size.z / 2
			? !1
			: !0;
	};
	Fireworks.Shape.Box.prototype.randomPoint = function (a) {
		a = a || this._vector;
		a.x = Math.random() * this.size.x - this.size.x / 2;
		a.y = Math.random() * this.size.y - this.size.y / 2;
		a.z = Math.random() * this.size.z - this.size.z / 2;
		a.addSelf(this.position);
		return a;
	};
	Fireworks.createShapePoint = function (a, b, c) {
		a = new Fireworks.Vector(a, b, c);
		return new Fireworks.Shape.Point(a);
	};
	Fireworks.Shape.Point = function (a) {
		this.position = a;
		this._vector = new Fireworks.Vector();
	};
	Fireworks.Shape.Point.prototype = new Fireworks.Shape();
	Fireworks.Shape.Point.prototype.constructor = Fireworks.Shape.Point;
	Fireworks.Shape.Point.prototype.contains = function (a) {
		return a.x !== this.position.x || a.y !== this.position.y || a.z !== this.position.z ? !1 : !0;
	};
	Fireworks.Shape.Point.prototype.randomPoint = function (a) {
		a = a || this._vector;
		a.copy(this.position);
		return a;
	};
	Fireworks.createShapeSphere = function (a, b, c, d) {
		a = new Fireworks.Vector(a, b, c);
		return new Fireworks.ShapeSphere(a, d);
	};
	Fireworks.ShapeSphere = function (a, b) {
		this.position = a;
		this.radius = b;
		this._vector = new Fireworks.Vector();
	};
	Fireworks.ShapeSphere.prototype = new Fireworks.Shape();
	Fireworks.ShapeSphere.prototype.constructor = Fireworks.ShapeSphere;
	Fireworks.ShapeSphere.prototype.contains = function (a) {
		return this._vector.sub(a, this.position).length() <= this.radius;
	};
	Fireworks.ShapeSphere.prototype.randomPoint = function (a) {
		a = a || this._vector;
		a.x = Math.random() - 0.5;
		a.y = Math.random() - 0.5;
		a.z = Math.random() - 0.5;
		var b = Math.random() * this.radius;
		a.setLength(b);
		a.addSelf(this.position);
		return a;
	};
	Fireworks.EffectsStackBuilder.prototype.spawnerOneShot = function (a) {
		a = a || this.emitter().nParticles();
		var b = this.emitter(),
			c = 0,
			d = !0;
		Fireworks.createEffect('spawner', {
			reset: function () {
				c = 0;
			},
			start: function () {
				d = !0;
			},
			stop: function () {
				d = !1;
			}
		})
			.onPreUpdate(function () {
				if (!1 !== d && a !== c) {
					for (var f = a - c, f = Math.min(f, b.deadParticles().length), e = 0; e < f; e++)
						b.spawnParticle();
					c += f;
				}
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.spawnerSteadyRate = function (a) {
		a = void 0 !== a ? a : 1;
		var b = this.emitter(),
			c = 1,
			d = !0;
		Fireworks.createEffect('spawner', {
			rate: a,
			start: function () {
				d = !0;
			},
			stop: function () {
				d = !1;
			}
		})
			.onPreUpdate(function (a) {
				var e = this.opts.rate;
				if (!1 !== d) {
					c += e * a;
					a = Math.floor(c);
					a = Math.min(a, b.deadParticles().length);
					c -= a;
					for (e = 0; e < a; e++) b.spawnParticle();
				}
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.renderToCanvas = function (a) {
		a = a || {};
		var b;
		if (!(b = a.ctx))
			(b = document.createElement('canvas')),
				(b.width = window.innerWidth),
				(b.height = window.innerHeight),
				document.body.appendChild(b),
				(b.style.position = 'absolute'),
				(b.style.left = 0),
				(b.style.top = 0),
				console.log('B4'),
				(b = b.getContext('2d')),
				console.log('a4ter');
		var c = b;
		b = Fireworks.createEffect('renderToCanvas', { ctx: c }).pushTo(this._emitter);
		if ('arc' === a.type)
			b.onCreate(function (a) {
				a.renderToCanvas = { size: 3 };
			}).onRender(function (a) {
				var b = a.position.vector;
				a = a.renderToCanvas.size;
				const e = document.createElement('canvas');
				const ctx = e.getContext('2d');
				console.log('FFF', c, e.getContext('2d'));
				ctx.beginPath();
				ctx.arc(b.x + canvas.width / 2, b.y + canvas.height / 2, a, 0, 2 * Math.PI, !0);
				ctx.fill();
			});
		else if ('drawImage' === a.type) {
			if ('string' === typeof a.image) {
				var d = [new Image()];
				d[0].src = a.image;
			} else
				a.image instanceof Image
					? (d = [a.image])
					: a.image instanceof Array
					? (d = a.image)
					: console.assert(!1, 'invalid .renderToCanvas() options');
			b.onCreate(function (a) {
				a.renderToCanvas = { scale: 1, opacity: 1, rotation: 0 * Math.PI };
			}).onRender(function (a) {
				var b = a.position.vector,
					g = a.renderToCanvas;
				a = a.lifeTime.normalizedAge();
				a = d[Math.floor(a * d.length)];
				c.save();
				c.translate(b.x + canvas.width / 2, b.y + canvas.height / 2);
				c.scale(g.scale, g.scale);
				c.rotate(g.rotation);
				c.globalAlpha = g.opacity;
				a instanceof Image
					? c.drawImage(a, -a.width / 2, -a.height / 2)
					: 'object' === typeof a
					? c.drawImage(
							a.image,
							a.offsetX,
							a.offsetY,
							a.width,
							a.height,
							-a.width / 2,
							-a.height / 2,
							a.width,
							a.height
					  )
					: console.assert(!1);
				c.restore();
			});
		} else console.assert(!1, 'renderToCanvas opts.type is invalid: ');
		return this;
	};
	Fireworks.EffectsStackBuilder.prototype.renderToThreejsObject3D = function (a) {
		var b = a.container;
		Fireworks.createEffect(a.effectId || 'renderToThreeParticleSystem')
			.onCreate(function (b) {
				b.threejsObject3D = { object3d: a.create() };
				Fireworks.debug && console.assert(b.threejsObject3D.object3d instanceof THREE.Object3D);
			})
			.onBirth(function (a) {
				b.add(a.threejsObject3D.object3d);
			})
			.onDeath(function (a) {
				b.remove(a.threejsObject3D.object3d);
			})
			.onRender(function (a) {
				var b = a.position.vector;
				a.threejsObject3D.object3d.position.set(b.x, b.y, b.z);
			})
			.pushTo(this._emitter);
		return this;
	};

	Fireworks.EffectsStackBuilder.prototype.renderToThreejsParticleSystem = function (a) {
		function b(a) {
			for (var b = new THREE.Geometry(), c = 0; c < a.nParticles(); c++)
				b.vertices.push(new THREE.Vector3());
			a = THREE.ParticleBasicMaterial;
			var c = 128,
				d = document.createElement('canvas'),
				h = d.getContext('2d');
			d.width = d.height = c;
			var j = h.createRadialGradient(
				d.width / 2,
				d.height / 2,
				0,
				d.width / 2,
				d.height / 2,
				d.width / 2
			);
			j.addColorStop(0, 'rgba(255,255,255,1)');
			j.addColorStop(0.5, 'rgba(255,255,255,1)');
			j.addColorStop(0.7, 'rgba(128,128,128,1)');
			j.addColorStop(1, 'rgba(0,0,0,1)');
			h.beginPath();
			h.arc(c / 2, c / 2, c / 2, 0, 2 * Math.PI, !1);
			h.closePath();
			h.fillStyle = j;
			h.fill();
			c = new THREE.Texture(d);
			c.needsUpdate = !0;
			a = new a({
				size: 5,
				sizeAttenuation: !0,
				color: 14687082,
				map: c,
				blending: THREE.AdditiveBlending,
				depthWrite: !1,
				transparent: !0
			});
			b = new THREE.ParticleSystem(b, a);
			b.dynamic = !0;
			b.sortParticles = !0;
			return b;
		}

		a = a || {};
		var c = a.effectId || 'renderToThreejsParticleSystem';
		a = a.particleSystem || b;
		'function' === typeof a && (a = a(this._emitter));
		console.assert(
			a instanceof THREE.ParticleSystem,
			'particleSystem MUST be THREE.ParticleSystem'
		);
		var d = a.geometry;
		console.assert(d.vertices.length >= this._emitter.nParticles());
		Fireworks.createEffect(c, { particleSystem: a })
			.onCreate(function (a, b) {
				a.threejsParticle = { particleIdx: b };
				d.vertices[b].set(Infinity, Infinity, Infinity);
			})
			.onDeath(function (a) {
				d.vertices[a.threejsParticle.particleIdx].set(Infinity, Infinity, Infinity);
			})
			.onRender(function (a) {
				var b = a.position.vector;
				d.vertices[a.threejsParticle.particleIdx].set(b.x, b.y, b.z);
			})
			.pushTo(this._emitter);
		return this;
	};
	Fireworks.Emitter.prototype.bindTriggerDomEvents = function (a) {
		new Fireworks.BindTriggerDomEvents(this, a);
		return this;
	};
	Fireworks.BindTriggerDomEvents = function (a, b) {
		this._domElement = b || document.body;
		this._onMouseDown = function () {
			a.effect('spawner').opts.start();
		};
		this._onMouseUp = function () {
			a.effect('spawner').opts.stop();
		};
		this._domElement.addEventListener('mousedown', this._onMouseDown);
		this._domElement.addEventListener('mouseup', this._onMouseUp);
		this._onMouseWheel = function (b) {
			var d = a.intensity(),
				d = d + (0 > b.wheelDelta ? -0.05 : 0.05),
				d = Math.max(d, 0),
				d = Math.min(d, 1);
			a.intensity(d);
		};
		this._domElement.addEventListener('mousewheel', this._onMouseWheel);
	};
	Fireworks.BindTriggerDomEvents.prototype.destroy = function () {
		this._domElement.removeEventListener('mousedown', this._onMouseDown);
		this._domElement.removeEventListener('mouseup', this._onMouseUp);
		this._domElement.removeEventListener('mousewheel', this._onMouseWheel);
	};
	Fireworks.DatGui4Emitter = function (a) {
		var b = new dat.GUI();
		a.effects().forEach(function (a, d) {
			var f = a.name || 'effect-' + d,
				e = a.opts || {},
				g = Object.keys(e).filter(function (a) {
					return e[a] instanceof Fireworks.Vector ? !0 : 'object' === typeof e[a] ? !1 : !0;
				});
			if (g.length) {
				var k = b.addFolder('Effect: ' + f);
				g.forEach(function (a) {
					e[a] instanceof Fireworks.Vector
						? (k.add(e[a], 'x').name(a + 'X'),
						  k.add(e[a], 'y').name(a + 'Y'),
						  k.add(e[a], 'z').name(a + 'Z'))
						: k.add(e, a);
				});
			}
		});
		return b;
	};
	Fireworks.ProceduralTextures = {};
	Fireworks.ProceduralTextures.buildTexture = function (a) {
		a = a || 150;
		var b = document.createElement('canvas'),
			c = b.getContext('2d');
		b.width = b.height = a;
		var d = c.createRadialGradient(
			b.width / 2,
			b.height / 2,
			0,
			b.width / 2,
			b.height / 2,
			b.width / 2
		);
		d.addColorStop(0, 'rgba(255,255,255,1)');
		d.addColorStop(0.5, 'rgba(255,255,255,1)');
		d.addColorStop(0.7, 'rgba(128,128,128,1)');
		d.addColorStop(1, 'rgba(0,0,0,1)');
		c.beginPath();
		c.arc(a / 2, a / 2, a / 2, 0, 2 * Math.PI, !1);
		c.closePath();
		c.fillStyle = d;
		c.fill();
		a = new THREE.Texture(b);
		a.needsUpdate = !0;
		return a;
	};

	return Fireworks;
}

export default function runFireworks(canvas, document) {
	const Fireworks = prerunFireworks(canvas, document);

	return Fireworks;
}
