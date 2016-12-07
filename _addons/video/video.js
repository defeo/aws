(function(node, meta) {
    /* Append video popup */
    var popup = node
	.append('div#video-popup')
	.append('div')
    var close = popup.append('a.close');
    close.href="#";
    close.append('i.fa.fa-close');
    var video = popup.append('video')
    video.setAttribute('controls', true);
    video.setAttribute('preload', 'metadata');
    if (meta.playbackRate)
	video.defaultPlaybackRate = meta.playbackRate;
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

    /* Append quizz popup */
    if (meta.quizzes) {
	var quizzes = popup.append('div#quizzes-popup');
	quizzes.append('h2 Questions de compréhension');
	meta.quizzes.forEach(function (q) {
	    clicker.injectPoll(q, quizzes.append('div.clicker-poll#clicker-' + q));
	});
	
	video.on('ended', function(e) {
	    quizzes.classList.add('shown');
	    (document.exitFullScreen || document.mozCancelFullScreen
	     || document.webkitExitFullScreen || document.msExitFullScreen).call(document);
	});
	close.on('click', function(e) {
	    quizzes.classList.remove('shown');
	});
    }
})($('#content'), eLeMentS.page.addons.video);
