var url = '/stats/' + (location.search ? 'user/' + location.search.substr(1) : 'me');

clicker._authXHR(url, clicker.user.token, function(answers, xhr) {
    if (xhr.status != 200)
	throw new Error(xhr.status + " " + answers.code + ": " + answers.message);

    var timeline = answers.filter(function (a) {
	return a !== null;
    }).map(function (a) {
	var answ = a.answers[0];
	return {
	    poll: a.poll,
	    date: new Date(answ.answer.date),
	    correct: answ.grade.on !== undefined ? (answ.grade.ok == answ.grade.on) : answ.grade.ok,
//	    ratio: answ.grade.on ? answ.grade.ok / answ.grade.on : null,
	    grade: answ.grade,
//	    choices: answ.answer.choices,
	}
    });
    timeline.sort(function(a, b) {
	return a.date - b.date;
    });

    var div = $('#clicker-results');
    quizzes.forEach(function (lesson) {
	if (lesson.quizzes.length) {
	    var res = div.append('div.clicker-poll');
	    res.append('h3').append('a ' + lesson.lesson).href = lesson.url;
	    var list = res.append('ul');
	    lesson.quizzes.forEach(function (quiz) {
		var answer = timeline.find(function (a) { return a.poll._id == quiz });
		if (answer !== undefined) {
		    list
			.append('li ' + answer.poll.title)
			.append('i.clicker-grade.fa' + (answer.correct ? '.fa-check' : '.fa-close'));
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

    var bar = $('#clicker-bar');
    var p = 1000*60*60*24;
    var period = function (date) {
	return Math.round(date.getTime() / p) * p;
    }
    var start = period(timeline[0].date);
    var end = period(timeline[timeline.length-1].date);
    var stats = new Map();
    for (var i = start; i <= end; i += p)
	stats.set(i, { total: 0, correct: 0 });
    timeline.forEach(function (a) {
	var start = period(a.date);
	for (var i = start; i <= end; i += p) {
	    var b = stats.get(i);
	    b.total++;
	    b.correct += a.correct;
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

    var freeze = timeline.reduce(function (stats, a) {
	if (a.date <= new Date('2016-03-15T13:00:00')) {
	    if (["56a7ab9487b68f1300ba90ae", "56a7a68087b68f1300ba90a3",
		 "56a7a34a87b68f1300ba909b", "56a7a8f187b68f1300ba90a8",
		 "56a6b6d387b68f1300ba9088", "56a6b6d387b68f1300ba9091"].indexOf(a.poll._id) == -1) {
		stats.total++;
		stats.correct += a.correct;
	    }
	} else {
	    stats.outoftime++;
	}
	return stats;
    }, { total: 0, correct: 0, outoftime: 0 });
    console.log(freeze);
    var note = Math.min(Math.round((2 * freeze.total + 4 * freeze.correct)*10/22)/10, 6);
    $('#clicker-grade').textContent = 'Note : ' + note + '/6';
    
}, function(err) {
    console.log(err);
    $('#clicker-results').append("p Une erreur s'est produite, veuillez réessayer");
});
