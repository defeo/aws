(function() {
    if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {

	    // closest thing possible to the ECMAScript 5 internal IsCallable
	    // function
	    if (typeof this !== "function")
		throw new TypeError(
		    "Function.prototype.bind - what is trying to be fBound is not callable"
		);

	    var aArgs = Array.prototype.slice.call(arguments, 1),
	    fToBind = this,
	    fNOP = function () {},
	    fBound = function () {
		return fToBind.apply( this instanceof fNOP ? this : oThis || window,
				      aArgs.concat(Array.prototype.slice.call(arguments)));
	    };

	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();

	    return fBound;
	};
    }
})();

var $ = (Document.prototype.$ = Document.prototype.querySelector).bind(document);
var $$ = (Document.prototype.$$ = Document.prototype.querySelectorAll).bind(document);
Element.prototype.$ = Element.prototype.querySelector;
Element.prototype.$$ = Element.prototype.querySelectorAll;
NodeList.prototype.forEach = Array.prototype.forEach;
