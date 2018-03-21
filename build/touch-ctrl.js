'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _doc = window.document;

var TouchCtrl = function () {
	function TouchCtrl(data) {
		_classCallCheck(this, TouchCtrl);

		data = initObject(data);
		data.range = initObject(data.range);
		this.target = data.target || _doc.getElementsByTagName('body')[0];
		this.callback = initObject(data.callback);
		this.speed = data.speed || 200;
		this.range = {
			x: data.range.x || 0,
			y: data.range.y || 0,
			w: data.range.w || this.target.clientWidth || this.target.offsetWidth,
			h: data.range.h || this.target.clientHeight || this.target.offsetHeight
		};
		this.range['max_x'] = this.range.x + this.range.w;
		this.range['max_y'] = this.range.y + this.range.h;
		var isTouch = 'ontouchstart' in window ? true : false;
		this.eventType = {
			start: isTouch ? 'touchstart' : 'mousedown',
			move: isTouch ? 'touchmove' : 'mousemove',
			end: isTouch ? 'touchend' : 'mouseup',
			cancel: isTouch ? 'touchcancel' : ''
		};
		this.isTouch = isTouch;
		this.fluctuation = data.fluctuation || 0.5;
		this.target.addEventListener(this.eventType['start'], this.start.bind(this), false);
	}

	_createClass(TouchCtrl, [{
		key: 'start',
		value: function start(e) {
			this.locate = this.touchLocation.call(this, e);
			this.nowX = this.locate.x;
			this.nowY = this.locate.y;
			this.initTime = Date.now();
			if (this.callback.start) {
				this.startKey = setInterval(this.callback.start(e, this.locate), this.speed);
			}
			this.target.addEventListener(this.eventType['move'], this.move.bind(this), false);
			this.target.addEventListener(this.eventType['end'], this.end.bind(this), false);
			this.target.addEventListener(this.eventType['cancel'], this.remove.bind(this), false);
			this.isClearTouchEvent = false;
		}
	}, {
		key: 'move',
		value: function move(e) {
			if (this.isClearTouchEvent) return undefined;
			this.locate = this.touchLocation.call(this, e);
			if (this.locate.x < this.range.x || this.locate.x > this.range.max_x || this.locate.y < this.range.y || this.locate.y > this.range.max_y) {
				this.isClearTouchEvent = true;
				return;
			}
			if (this.callback.move) {
				this.callback.move(e, this.locate);
			}
			this.prevLocate = this.locate;
		}
	}, {
		key: 'end',
		value: function end(e) {
			if (this.callback.end) {
				this.callback.end(e, this.locate);
			}
			this.remove();
		}
	}, {
		key: 'remove',
		value: function remove() {
			this.locate = {};
			this.target.removeEventListener(this.eventType['move'], this.move, true);
			this.target.removeEventListener(this.eventType['end'], this.end, true);
			this.target.removeEventListener(this.eventType['cancel'], this.remove, true);
			this.isClearTouchEvent = true;
			clearInterval(this.startKey);
		}
	}, {
		key: 'touchLocation',
		value: function touchLocation() {
			var e = arguments[0];
			if (!arguments[0]) return undefined;
			var x = cutDecimal(this.isTouch ? e.touches[0].clientX : e.pageX);
			var y = cutDecimal(this.isTouch ? e.touches[0].clientY : e.pageY);
			var prevX = this.prevLocate ? this.prevLocate.x : x;
			var prevY = this.prevLocate ? this.prevLocate.y : y;
			var distanceX = cutDecimal(x - (prevX || x));
			var distanceY = cutDecimal(y - (prevY || y));
			var isStop = Math.abs(distanceX) < this.fluctuation && Math.abs(distanceY) < this.fluctuation ? true : false;
			var isTop = void 0,
			    isRight = void 0,
			    isBottom = void 0,
			    isLeft = void 0;
			if (isStop && this.prevLocate) {
				isTop = this.prevLocate.t;
				isRight = this.prevLocate.r;
				isBottom = this.prevLocate.b;
				isLeft = this.prevLocate.l;
			} else {
				isTop = distanceY < this.fluctuation ? true : false;
				isRight = distanceX < this.fluctuation ? true : false;
				isBottom = distanceY > this.fluctuation ? true : false;
				isLeft = distanceX > this.fluctuation ? true : false;
			}
			return {
				x: x,
				y: y,
				t: isTop,
				r: isRight,
				b: isBottom,
				l: isLeft,
				dx: distanceX,
				dy: distanceY,
				isStop: isStop,
				isMove: !isStop
			};
		}
	}]);

	return TouchCtrl;
}();

var cutDecimal = function cutDecimal(int) {
	return Math.floor(int * 100) / 100;
};

var initObject = function initObject(data) {
	return (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data : {};
};