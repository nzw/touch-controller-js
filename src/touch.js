const _doc = window.document;

class TouchCtrl {
	constructor(data) {
		data          = initObject(data);
		data.range    = initObject(data.range);
		this.target   = data.target || _doc.getElementsByTagName('body')[0];
		this.callback = initObject(data.callback);
		this.speed    = data.speed || 200;
		this.range    = {
			x : data.range.x || 0,
			y : data.range.y || 0,
			w : data.range.w || this.target.clientWidth  || this.target.offsetWidth,
			h : data.range.h || this.target.clientHeight || this.target.offsetHeight,
		};
		this.range['max_x'] = this.range.x + this.range.w;
		this.range['max_y'] = this.range.y + this.range.h;
		let isTouch = ('ontouchstart' in window) ? true : false;
		this.eventType = {
			start:  isTouch ? 'touchstart'  : 'mousedown',
			move:   isTouch ? 'touchmove'   : 'mousemove',
			end:    isTouch ? 'touchend'    : 'mouseup',
			cancel: isTouch ? 'touchcancel' : ''
		};
		this.isTouch = isTouch;
		this.fluctuation = data.fluctuation || 0.5;
		this.target.addEventListener(this.eventType['start'], this.start.bind(this), false);
	}

	start(e) {
		this.locate   = this.touchLocation.call(this, e);
		this.nowX     = this.locate.x;
		this.nowY     = this.locate.y;
		this.initTime = Date.now();
		if (this.callback.start) {
			this.startKey = setInterval(this.callback.start.call(this, e), this.speed);
		}
		this.target.addEventListener(this.eventType['move'],   this.move.bind(this),   false);
		this.target.addEventListener(this.eventType['end'],    this.end.bind(this),    false);
		this.target.addEventListener(this.eventType['cancel'], this.remove.bind(this), false);
		this.isClearTouchEvent = false;
	}

	move(e) {
		if (this.isClearTouchEvent) return undefined;
		this.locate = this.touchLocation.call(this, e);
		if (this.locate.x < this.range.x || this.locate.x > this.range.max_x
			|| this.locate.y < this.range.y || this.locate.y > this.range.max_y
		) {
			this.isClearTouchEvent = true;
			return;
		}
		if (this.callback.move) {
			this.callback.move.call(this, e);
		}
		this.prevLocate = this.locate;
	}

	end(e) {
		if (this.callback.end) {
			this.callback.end.call(this, e);
		}
		this.remove();
	}

	remove() {
		this.locate = {};
		this.target.removeEventListener(this.eventType['move'],   this.move,   true);
		this.target.removeEventListener(this.eventType['end'],    this.end,    true);
		this.target.removeEventListener(this.eventType['cancel'], this.remove, true);
		this.isClearTouchEvent = true;
		clearInterval(this.startKey);
	}

	touchLocation() {
		const e = arguments[0];
		if(!arguments[0]) return undefined;
		let x = cutDecimal(this.isTouch ? e.touches[0].clientX : e.pageX);
		let y = cutDecimal(this.isTouch ? e.touches[0].clientY : e.pageY);
		let prevX = this.prevLocate ? this.prevLocate.x : x;
		let prevY = this.prevLocate ? this.prevLocate.y : y;
		let distanceX = cutDecimal(x - (prevX || x));
		let distanceY = cutDecimal(y - (prevY || y));
		let isStop = (Math.abs(distanceX) < this.fluctuation
				&& Math.abs(distanceY) < this.fluctuation)
				? true : false;
		let isTop, isRight, isBottom, isLeft;
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
			x  : x,
			y  : y,
			t  : isTop,
			r  : isRight,
			b  : isBottom,
			l  : isLeft,
			dx : distanceX,
			dy : distanceY,
			isStop : isStop,
			isMove : !isStop
		};
	}

}
const cutDecimal = int => {
	return Math.floor(int * 100) / 100;
};

const initObject = data => {
	return typeof data === 'object' ? data : {};
};
