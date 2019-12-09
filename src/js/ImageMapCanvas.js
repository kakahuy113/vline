export default class ImageMapCanvas {

	constructor(selector) {
		// initialize value
		this.selector = document.querySelector(selector);
		if (this.selector) {
			this.map = this.selector.querySelector('map');
			this.canvas = this.selector.querySelector('canvas');
			this.canvasContext = this.canvas.getContext("2d");
			this.mapImage = this.selector.querySelector('img');
			this.imageUrl = this.mapImage.getAttribute('src');
		}

		// Start plugins
		if (this.canvas) {
			this.init();
		}
	}

	init() {
		imageMapResize();
		this.canvas.style.backgroundImage = `url('${this.imageUrl}')`;
		this.canvas.classList.add('background-added');
		this.setSizeImageMapCanvas();
		window.addEventListener('resize', () => {
			this.clearImageMap();
			this.setSizeImageMapCanvas();
		})
		this.registerEvents();
	}

	clearImageMap = () => {
		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawPolygon = (coords) => {
		const coordsRef = coords.split(",");
		const coordsRef2 = coordsRef.map(item => {
			return Number(item) + 3;
		})
		const regionLength = coordsRef.length;
		this.canvasContext.save();
		this.canvasContext.beginPath();
		this.canvasContext.moveTo(coordsRef2[0], coordsRef2[1]);
		for (let i = 0; i < regionLength; i++) {
			if (i % 2 == 0 && i > 1) {
				this.canvasContext.lineTo(coordsRef2[i], coordsRef2[i + 1]);
			}
		}
		this.canvasContext.closePath();
		this.canvasContext.stroke();
		this.canvasContext.fill();
		this.canvasContext.restore();
	}

	drawCircle = (coords) => {
		const coordsRef = coords.split(",");
		this.canvasContext.save();
		this.canvasContext.beginPath();
		this.canvasContext.arc(coordsRef[0], coordsRef[1], coordsRef[2], 0, 2 * Math.PI);
		this.canvasContext.closePath();
		this.canvasContext.stroke();
		this.canvasContext.fill();
		this.canvasContext.restore();
	}

	registerEvents() {
		Array.from(this.map.querySelectorAll('area')).forEach(mapArea => {
			mapArea.addEventListener('mouseover', () => {
				let coords = mapArea.getAttribute('coords');
				let shape = mapArea.getAttribute('shape');
				if (shape === 'poly') {
					// set style
					this.canvasContext.strokeStyle = '#e8de8b';
					this.canvasContext.fillStyle = 'rgba(7, 65, 76,.25)';
					this.canvasContext.lineWidth = 5;
					this.drawPolygon(coords);
				}
				if (shape === 'circle') {
					// set style
					this.canvasContext.strokeStyle = 'rgba(7, 65, 76, 1)';
					this.canvasContext.fillStyle = 'rgba(7, 65, 76, .35)';
					this.canvasContext.lineWidth = 3;
					this.drawCircle(coords);
				}
			});
			mapArea.addEventListener('mouseout', () => {
				this.clearImageMap();
			})
		})
	}

	setSizeImageMapCanvas = () => {
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
	}

	customLabel() {
		if (this.selector) {
			Array.from(this.map.querySelectorAll('area')).forEach(area => {
				let infoMarker;
				area.addEventListener('click', e => {
					e.preventDefault();
				})
				area.addEventListener('mouseenter', e => {
					infoMarker = document.createElement('div');
					infoMarker.classList.add('info-marker');
					infoMarker.innerHTML = `<div class="img"><img src="${area.getAttribute('href')}" /></div><div class="text">${area.getAttribute('title')}</div>`;
					const offsetTop = this.canvas.getBoundingClientRect().top;
					const coordsRef = area.getAttribute('coords').split(',');
					const size = Number(coordsRef[2]);
					const top = Number(coordsRef[1]);
					const left = Number(coordsRef[0]);
					if (left - (size * 0.95) + 50 <= Number(window.innerWidth - 450 - 60)) {
						infoMarker.setAttribute('style', `
							margin-left: 25px;
							transform-origin: 0 0;
							top: ${top - size + this.selector.offsetTop}px;
							left: ${left}px;
						`);
					} else {
						infoMarker.setAttribute('style', `
							margin-right: 25px;
							transform-origin: 100% 0;
							top: ${top - size + this.selector.offsetTop}px;
							right: ${this.canvas.clientWidth - left}px;
						`);
					}
					document.querySelector('body').parentNode.append(infoMarker);
					setTimeout(() => {
						infoMarker.classList.add('active');
					}, 150);
				});
				area.addEventListener('mouseout', e => {
					infoMarker.parentNode.removeChild(infoMarker);
					infoMarker.classList.remove('active');
				})
			})
		}
	}
}