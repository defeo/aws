function timeline(answers) {
    var timeline = answers.map(function (a) {
	var answ = a.answers[a.answers.length - 1];
	var ret = {
	    poll: a.poll,
	    date: new Date(answ.answer.date),
//	    ratio: answ.grade.on ? answ.grade.ok / answ.grade.on : null,
	    grade: answ.grade,
//	    choices: answ.answer.choices,
	};
	if (ret.grade) {
	    ret.correct = answ.grade.on !== undefined
	    ? (answ.grade.ok == answ.grade.on)
	    : answ.grade.ok;
	}
	return ret;
    });
    timeline.sort(function(a, b) {
	return a.date - b.date;
    });
    return timeline;
}

function grade(timeline, deadline) {
    var answered = timeline.length;
    var correct = timeline.filter(function(a) { return a.correct; }).length;
    var total = quizzes.reduce(function (c, l) { return c + l.quizzes.lenght }, 0)
    console.log(total, answered, correct);
    return Math.min(Math.round((2 * freeze.total + 4 * freeze.correct)*10/total)/10, 6);
}

function gradeAll(users) {
    users.forEach(function(u) {
	clicker._authXHR('/stats/user/' + u._id, clicker.user.token, function(answers, xhr) {
	    u.grade = grade(timeline(answers));
	}, function(err) {
	    console.log(err);
	});
    });
}
