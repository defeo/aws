(function(elt, meta) {
    var popup = elt
	.append('div#video-popup')
	.append('div')
    var close = popup.append('a.close');
    close.href="#";
    close.append('i.fa.fa-close');
    var video = popup.append('video')
    video.setAttribute('controls', true);
    video.setAttribute('preload', 'metadata');
    var src = video.append('source');
    video.setAttribute('src', meta.url
		       + (meta.start || meta.end ? + '#t=' + meta.start : '')
		       + (meta.end ? meta.end : ''));
    if (meta.type)
	src.setAttribute('type', 'video/webm');

    // Chrome fix
    var tmp = window.location.hash
    window.location.hash = '#';
    window.location.hash = tmp;
})(document.body, ClassBP.page.addons.video);
