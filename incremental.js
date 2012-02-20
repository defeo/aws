var Incremental = {
    cursorBlink:        500,
    defaultSpeed:       150,
    defaultPauseBefore: 100,
    defaultPauseAfter:  100,
    defaultByLetter:      0,

    getElts : function() {
	this.elts = document.getElementsByClassName('incremental');
	for (var i = 0 ; i < this.elts.length ; i++)
	    this.elts[i].style.visibility = 'hidden';
    },

    prepare : function() {
	this.curIndex++;
	if (this.curIndex < this.elts.length) {
	    this.curElt = this.elts[this.curIndex];
	    this.speed = this.curElt.dataset.incrementalSpeed ||
		this.defaultSpeed;
	    this.pauseBefore =
		this.curElt.dataset.incrementalPauseBefore ||
		this.defaultPauseBefore;
	    this.pauseAfter =
		this.curElt.dataset.incrementalPauseAfter ||
		this.defaultPauseAfter;
	    this.byLetter = 
		this.curElt.dataset.incrementalByLetter !== undefined;

	    setTimeout(function() {Incremental.show()}, this.pauseBefore);
	} else {
	    this.running = false;
	}
    },

    show : function() {
	if (this.byLetter) {
	    if (!this.text) {
		this.text = this.curElt.firstChild.data;
		this.textIndex = 1;
		this.curElt.style.visibility = 'visible';
		this.curElt.appendChild(this.cursor.elt);
	    }

	    if (this.textIndex <= this.text.length) {
		this.curElt.firstChild.data =
		    this.text.substring(0, this.textIndex);
		this.textIndex++;
		setTimeout(function(){Incremental.show()}, this.speed);
	    } else {
		this.text = undefined;
		setTimeout(function(){Incremental.prepare()}, this.pauseAfter);
	    }
	} else {
	    this.curElt.style.visibility = 'visible';	
	    this.curElt.appendChild(this.cursor.elt);
	    setTimeout(function(){Incremental.prepare()}, this.pauseAfter);
	}
    },

    start : function() {
	if (!this.running) {
	    this.running = true;

	    if (!this.cursor)
		this.cursor = new Incremental.Cursor(this.cursorBlink);

	    this.curIndex = -1;
	    this.getElts();
	    this.prepare();
	}
    }
}

Incremental.Cursor = function(speed) {
    var blink = function(obj) {
	if (obj.style.visibility == 'visible')
	    obj.style.visibility = 'hidden';
	else
	    obj.style.visibility = 'visible';
    }

    this.elt = document.createElement('span');
    this.elt.appendChild(document.createTextNode('_'));

    this.timeout = setInterval(blink, speed, this.elt);

    this.destroy = function() {	clearInterval(this.timeout) }
}
