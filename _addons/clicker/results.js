var url = '/stats/' + (location.search ? 'user/' + location.search.substr(1) : 'me');

clicker._authXHR(null, url, clicker.user.token, function(answers, xhr) {
    if (xhr.status != 200)
	throw new Error(xhr.status + " " + answers.code + ": " + answers.message);

    var time = timeline(answers);
    
    var div = $('#clicker-results');
    quizzes.forEach(function (lesson) {
	if (lesson.quizzes.length) {
	    var res = div.append('div.clicker-poll-block');
	    res.append('h3').append('a ' + lesson.lesson).href = lesson.url;
	    var list = res.append('ul');
	    lesson.quizzes.forEach(function (quiz) {
		var answer = time.find(function (a) { return a.poll._id == quiz });
		if (answer !== undefined) {
		    var q = list.append('li.answered ' + answer.poll.title);
		    if (answer.grade)
			q.append('i.clicker-grade.fa' + (answer.correct ? '.fa-check' : '.fa-close'));
		} else {
		    clicker._authXHR(null, '/polls/' + quiz, clicker.user.token, function(poll) {
			var q = list.append('li ' + poll.title);
			if (poll.can.answer === false) {
			    q.classList.add('past')
			} else if (poll.can.answer !== true) {
			    q.dataset.deadline = (new Date(poll.can.answer)).toLocaleString(false, {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: 'numeric',
			    });
			}
		    }, function (err) {
			console.log(err);
			list.append('li ' + quiz);
		    });
		}
	    });
	}
    });

    var bar = $('#clicker-bar');
    var p = 1000*60*60*24;
    var period = function (date) {
	return Math.round(date.getTime() / p) * p;
    }
    var start = period(time[0].date);
    var end = period(time[time.length-1].date);
    var stats = new Map();
    for (var i = start; i <= end; i += p)
	stats.set(i, { total: 0, correct: 0, score: 0 });
    time.forEach(function (a) {
	var start = period(a.date);
	for (var i = start; i <= end; i += p) {
	    var b = stats.get(i);
	    b.total++;
	    b.correct += a.correct;
	    b.score += a.score;
	}
    });
    new Chart(bar.getContext("2d")).Line({
	labels: Array.from(stats.keys()).map(function (k) {
	    return new Date(k).toDateString();
	}).concat(['']),
	datasets: [
	    { label: 'Réponses', data: Array.from(stats.values()).map(function (b) {
		return b.total;
	    }), fillColor: 'red', pointColor: 'red' },
	    { label: 'Score', data: Array.from(stats.values()).map(function (b) {
		return Math.round(b.score*100)/100;
	    }), fillColor: 'yellow', pointColor: 'yellow' },
	    { label: 'Correctes', data: Array.from(stats.values()).map(function (b) {
		return b.correct;
	    }), fillColor: 'green', pointColor: 'green' },
	    { label: 'sur', data: Array(stats.size+1).fill(quizzes.reduce(function (sum, q) {
		return sum + q.quizzes.length;
	    }, 0)), pointColor: 'transparent', pointStrokeColor: 'transparent',
	      fillColor: 'transparent', strokeColor: 'gray' }
	],
    }, {
	animation: false,
	bezierCurve: false,
    });

    $('#clicker-grade').textContent = 'Note : ' + grade(time, count(quizzes)) + '/6 ';
    var help = $('#clicker-grade')
	.append('a <i class="fa fa-question-circle"></i>');
    help.href = 'https://github.com/defeo/aws/blob/gh-pages/_addons/clicker/grading.js#L35-L42';
    help.target = '_blank';
    
}, function(err) {
    console.log(err);
    $('#clicker-results').append("p Une erreur s'est produite, veuillez réessayer");
});
