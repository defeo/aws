(function () {
    var oldn, xhr = new XMLHttpRequest();
    var badge = $('.elements-addon-muut .title').append('code');
    badge.css({
	display: 'none',
	fontStyle: 'normal',
	borderRadius: '1ex',
	padding: '0 0.8ex',
	backgroundColor: 'rgba(0,0,0,0.6)',
	color: 'rgba(255,255,255,0.9)',
	fontSize: '50%',
	verticalAlign: 'super',
	marginLeft: '0.5ex',
    });
    
    xhr.onload = function(e) {
        var n = this.response['/webdev-uvsq'].size;
        if (n) {
            badge.css({ display: 'inline' });
            badge.textContent = n;
            if (oldn !== undefined && n > oldn)
		badge.css({
		    backgroundColor: 'rgba(0,0,0,0.4)',
		    boxShadow: '0 0 2px 2px rgba(0,0,0,0.4)'
		});
            oldn = n;
        }
        setTimeout(fetch, 30*1000);
    };
    var fetch = function() {
        xhr.open('GET', 'http://api.muut.com/postcounts?path=/webdev-uvsq');
        xhr.responseType = 'json';
        xhr.send();
    }
    fetch();
})();
