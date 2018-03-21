/**
 * bind 実装
 * ES5以前の古いiOSやAndroid端末では使用できないため
 */
if (typeof Function.prototype.bind === "undefined") {
	Function.prototype.bind = function(thisArg) {
		var _this = this;
		var slice = Array.prototype.slice;
		var args  = slice.call(arguments, 1); // arguments[1]以降を渡す
		return function() {
			return _this.apply(thisArg, args.concat(slice.call(arguments)));
		};
	};
}
