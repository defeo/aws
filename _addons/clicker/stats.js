clicker._authXHR('/users', clicker.user.token, function(users, xhr) {
    if (xhr.status != 200)
	throw new Error(xhr.status + " " + answers.code + ": " + answers.message);

    var udiv = $('#stats-users').append('ul');
    var month = 1000*60*60*24*30;
    var now = new Date();
    users.forEach(function (u) { u.lastSeen = new Date(u.lastSeen); });
    users.sort(function(a,b) { return b.lastSeen - a.lastSeen; });
    users.forEach(function(u) {
	if (u._id.substr(0,5) == 'saml:') {
	    var staleness = Math.max(now - u.lastSeen, 0);
	    var a = udiv.append('li').append('a ' + u._id.substr(5));
	    a.href = "results?" + u._id;
	    a.css({ opacity: Math.max((month - staleness)/month, 0.1) });
	}
    });
});

lessons.forEach(function(l) {
    var qdiv = $('#stats-questions');
    if (l.quizzes.length) {
	qdiv.append('h3').append('a ' + l.lesson).href = l.url;
	var quizzes = qdiv.append('ul');
	l.quizzes.forEach(function(q) {
	    var quiz = quizzes.append('li');
	    var title = quiz.append('h4 <span></span> <span></span>');
	    var statdiv = quiz.append('p');
	    clicker._authXHR('/stats/poll/' + q, clicker.user.token, function(answers, xhr) {
		var timeline = answers.map(function (a) {
		    var answ = a.answers.reduce(function(min, a) {
			return new Date(a.date) < new Date(min.date) ? a : min;
		    });
		    return {
			user: a.user,
			date: new Date(answ.date),
			correct: answ.grade.on !== undefined ? (answ.grade.ok == answ.grade.on) : answ.grade.ok,
			ratio: answ.grade.on ? answ.grade.ok / answ.grade.on : null,
			grade: answ.grade,
			choices: answ.choices,
		    }
		});
		timeline.sort(function(a, b) {
		    return a.date - b.date;
		});
		var stats = timeline.reduce(function (stats, a) {
		    stats.total++;
		    stats.correct += a.correct;
		    stats.ratio += a.ratio ? a.ratio : 0;
		    return stats;
		}, {
		    total: 0,
		    correct: 0,
		    ratio: 0,
		});
		title.$('span:nth-child(2)').textContent =
		    stats.correct + '/' + stats.total
		    + ' (' + (Math.round(stats.correct / stats.total * 1000) / 10) + '%'
		    + ((stats.ratio)
		       ? ' – ' + (Math.round(stats.ratio / stats.total * 1000) / 10) + '%)'
		       : ')');

		var p = 1000*60*60*24;
		var period = function (date) {
		    return Math.round(date.getTime() / p) * p;
		}
		var start = period(timeline[0].date);
		var end = period(timeline[timeline.length-1].date);
		var byperiod = new Map();
		for (var i = start; i <= end; i += p)
		    byperiod.set(i, { total: 0, correct: 0 });
		timeline.forEach(function (a) {
		    var b = byperiod.get(period(a.date));
		    b.total++;
		    b.correct += a.correct;
		});
		var canvas = statdiv.append('canvas');
		canvas.width = 1000;
		canvas.height = 400;
		new Chart(canvas.getContext("2d")).Line({
		    labels: Array.from(byperiod.keys()).map(function (k) {
			return new Date(k).toDateString();
		    }),
		    datasets: [
			{ label: 'total', data: Array.from(byperiod.values()).map(function (b) {
			    return b.total;
			}), fillColor: 'red' },
			{ label: 'correct', data: Array.from(byperiod.values()).map(function (b) {
			    return b.correct;
			}), fillColor: 'green' },
		    ]
		}, {
		    animation: false,
		    bezierCurve: false,
		});
	    });
	    clicker._authXHR('/polls/' + q, clicker.user.token, function(poll, xhr) {
		title.$('span:nth-child(1)').textContent = poll.title;
	    });
	});
    }
});
