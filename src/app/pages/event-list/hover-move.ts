import anime from "animejs";
import imagesLoaded from "imagesloaded";

const extend = (a, b) => {
	for (let key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};

// from http://www.quirksmode.org/js/events_properties.html#position
const getMousePos = function(ev) {
	let posx = 0;
	let posy = 0;
	if (!ev) ev = window.event;
	if (ev.pageX || ev.pageY) {
		posx = ev.pageX;
		posy = ev.pageY;
	} else if (ev.clientX || ev.clientY) {
		posx =
			ev.clientX +
			document.body.scrollLeft +
			document.documentElement.scrollLeft;
		posy =
			ev.clientY +
			document.body.scrollTop +
			document.documentElement.scrollTop;
	}
	return { x: posx, y: posy };
};

const TiltObj = function(el, options) {
	this.el = el;
	this.options = extend({}, this.options);
	extend(this.options, options);
	this.DOM = {};
	this.DOM.img = this.el.querySelector(".content__img");
	this.DOM.title = this.el.querySelector(".content__title");
	this._initEvents();
};

TiltObj.prototype.options = {
	movement: {
		img: { translation: { x: -40, y: -40 } },
		title: { translation: { x: 20, y: 20 } }
	}
};

TiltObj.prototype._initEvents = function() {
	this.mouseenterFn = ev => {
		anime.remove(this.DOM.img);
		anime.remove(this.DOM.title);
	};

	this.mousemoveFn = ev => {
		requestAnimationFrame(() => this._layout(ev));
	};

	this.mouseleaveFn = ev => {
		requestAnimationFrame(() => {
			anime({
				targets: [this.DOM.img, this.DOM.title],
				duration: 1500,
				easing: "easeOutElastic",
				elasticity: 400,
				translateX: 0,
				translateY: 0
			});
		});
	};

	this.el.addEventListener("mousemove", this.mousemoveFn);
	this.el.addEventListener("mouseleave", this.mouseleaveFn);
	this.el.addEventListener("mouseenter", this.mouseenterFn);
};

TiltObj.prototype._layout = function(ev) {
	// Mouse position relative to the document.
	const mousepos = getMousePos(ev);
	// Document scrolls.
	const docScrolls = {
		left: document.body.scrollLeft + document.documentElement.scrollLeft,
		top: document.body.scrollTop + document.documentElement.scrollTop
	};
	const bounds = this.el.getBoundingClientRect();
	// Mouse position relative to the main element (this.DOM.el).
	const relmousepos = {
		x: mousepos.x - bounds.left - docScrolls.left,
		y: mousepos.y - bounds.top - docScrolls.top
	};

	// Movement settings for the animatable elements.
	const t = {
		img: this.options.movement.img.translation,
		title: this.options.movement.title.translation
	};

	const transforms = {
		img: {
			x:
				((-1 * t.img.x - t.img.x) / bounds.width) * relmousepos.x +
				t.img.x,
			y:
				((-1 * t.img.y - t.img.y) / bounds.height) * relmousepos.y +
				t.img.y
		},
		title: {
			x:
				((-1 * t.title.x - t.title.x) / bounds.width) * relmousepos.x +
				t.title.x,
			y:
				((-1 * t.title.y - t.title.y) / bounds.height) * relmousepos.y +
				t.title.y
		}
	};
	this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform =
		"translateX(" +
		transforms.img.x +
		"px) translateY(" +
		transforms.img.y +
		"px)";
	this.DOM.title.style.WebkitTransform = this.DOM.title.style.transform =
		"translateX(" +
		transforms.title.x +
		"px) translateY(" +
		transforms.title.y +
		"px)";
};

const DOM = { contentElems: [], contentLinks: [], footer: null };
// DOM.svg = document.querySelector(".morph");
// DOM.shapeEl = DOM.svg.querySelector("path");
DOM.contentElems = Array.from(document.querySelectorAll(".content-wrap"));
DOM.contentLinks = Array.from(document.querySelectorAll(".content__link"));
DOM.footer = document.querySelector(".content--related");
const contentElemsTotal = DOM.contentElems.length;

// let step;

export function init() {
	imagesLoaded(document.body, () => {
		Array.from(document.querySelectorAll(".content--layout")).forEach(
			el => new TiltObj(el, null)
		);
		// Remove loading class from body
		document.body.classList.remove("loading");
	});
}
// export init;

// init();
