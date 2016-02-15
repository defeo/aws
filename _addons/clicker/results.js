clicker._authXHR('/stats/me', clicker.user.token, function(answers) {
    var div = $('#clicker-results');
    var bar = $('#clicker-bar');

    var correct = 0, wrong = 0, total = 0;
    
    quizzes.forEach(function (lesson) {
	if (lesson.quizzes.length) {
	    var res = div.append('div.clicker-poll');
	    res.append('h3').append('a ' + lesson.lesson).href = lesson.url;
	    var list = res.append('ul');
	    lesson.quizzes.forEach(function (quiz) {
		total++;
		var answer = answers.find(function (a) { return a.poll._id == quiz });
		if (answer !== undefined) {
		    var grade = (function(g) {
			return g.on !== undefined ? g.ok == g.on : g.ok;
		    })(answer.answers[0].grade);
		    list
			.append('li ' + answer.poll.title)
			.append('i.clicker-grade.fa' + (grade ? '.fa-check' : '.fa-close'));
		    grade ? correct++ : wrong++;
		} else {
		    clicker._authXHR('/polls/' + quiz, clicker.user.token, function(poll) {
			list.append('li ' + poll.title);
		    }, function (err) {
			console.log(err);
			list.append('li ' + quiz);
		    });
		}
	    });
	}
    });

    stops = (function (stops, scale) {
	var acc = 0;
	return stops.map(function(s) { return acc += s*scale });
    })([correct, wrong], 100 / total);
    console.log(bar.style.background = 'linear-gradient(to right, ' + (function (colors, stops) {
	var ret = colors[0] + ',';
	for (var i = 0; i < stops.length; i++) {
	    ret += colors[i] + ' ' + stops[i] + '%,' + colors[i+1] + ' ' + stops[i] + '%,';
	}
	return ret + colors[i];
    })(['#0f0', '#f44', 'transparent'], stops) + ')');
}, function(err) {
    console.log(err);
    $('#clicker-results').append("p Une erreur s'est produite, veuillez réessayer");
});
