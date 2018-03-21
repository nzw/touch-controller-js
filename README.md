# touch-ctrl-js
スマートフォン用のタッチ操作ライブラリです。  
config の設定を行わなくても利用可能。  

## How to use
```
	<div id="controller">test</div>
	<script>
	var config = {
		target: document.getElementById('controller'),
		callback: {
			start: startEvent,
			move : moveEvent,
			end  : endEvent
		}
	};
	TouchCtrl.init(config);
	function startEvent(e) {
		console.log(e);
		console.log(this.locate);
	}
	function moveEvent(e) {
		console.log(e);
		console.log(this.locate);
	}
	function endEvent(e) {
		console.log(e);
		console.log(this.locate);
	}
	</script>
```
## Use options
```
	var config = {
		/**
		 * @@タッチ可能範囲
		 * @default: config.targetの範囲
		 */
		target: document.getElementById('controller'),

		/**
		 * @@タッチのフレームレート
		 * @default: 1/200ms
		 */
		speed : 200,

		/**
		 * @@タッチ可能範囲
		 * @default: config.targetの範囲
		 * @param: x(X座標)
		 * @param: y(Y座標)
		 * @param: w(X座標からの横幅)
		 * @param: h(Y座標からの横幅)
		 */
		range : {
			x: 0,
			y: 0,
			w: 500,
			h: 300
		},

		/**
		 * @@タッチ時の誤動作許容範囲
		 * @default: 0.5px
		 */
		fluctuation: 0.1,

		/**
		 * @@コールバック
		 * @default: なし
		 * @戻り値: this.locate とTouchEvent
		 */
		callback: {
			start: startEvent,
			move : moveEvent,
			end  : endEvent
		}
	};
```

## Callback arguments
#### TouchEvent

## Callback this.locate
```
// this.locate で取得可能
{
	x  : x,				// X座標（Float）
	y  : y,				// Y座標（Float）
	t  : isTop,			// タッチが上に移動したか（Boolean）
	r  : isRight,		// タッチが右に移動したか（Boolean）
	b  : isBottom,		// タッチが右に移動したか（Boolean）
	l  : isLeft,		// タッチが右に移動したか（Boolean）
	dx : distanceX, 	// X軸への移動距離（Float）
	dy : distanceY,		// Y軸への移動距離（Float）
	isStop : isStop,	// 停止情報（Boolean)
	isMove : !isStop	// 移動情報（Boolean)
}
```
## Compile src/touch.js
```
gulp babel
```

## Watch src/touch.js
```
gulp watch
```
