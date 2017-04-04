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
	    ret.score = answ.grade.on !== undefined
		? 2 * answ.grade.ok / answ.grade.on - 1
		: Number(answ.grade.ok);
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
    var score = timeline.reduce(function(sum, a) { return sum + a.score; }, 0);
    var total = quizzes.reduce(function (c, l) { return c + l.quizzes.length }, 0)

    console.log(total, answered, score);
    return Math.round((2 * answered + 4 * score)/total * 10)/10;
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
