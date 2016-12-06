(function() {
    config = {
	config: ["MMLorHTML.js"],
	jax: ["input/TeX","input/AsciiMath","output/HTML-CSS","output/NativeMML"],
	extensions: ["MathMenu.js","MathZoom.js"],
	TeX: {
            extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"],
	}
    };
    
    var opt = eLeMentS.page.addons.mathjax.options;
    if (opt) {
	for (var p in opt) {
	    if (p == 'TeX') {
		for (var q in opt.TeX)
		    config.TeX[q] = opt.TeX[q];
	    } else {
		config[p] = opt[p];
	    }
	}
    }

    window.MathJax = config;
})();
